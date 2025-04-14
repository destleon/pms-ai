const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const { httpMethod, path, body } = event;
        const inventoryTable = process.env.INVENTORY_TABLE;
        const medicinesTable = process.env.MEDICINES_TABLE;

        switch (httpMethod) {
            case 'GET':
                if (path.includes('/medicine/')) {
                    const medicineId = path.split('/').pop();
                    const inventory = await getMedicineInventory(medicineId, inventoryTable);
                    return {
                        statusCode: 200,
                        body: JSON.stringify(inventory)
                    };
                }
                break;

            case 'POST':
                const inventoryData = JSON.parse(body);
                await updateInventory(inventoryData, inventoryTable, medicinesTable);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Inventory updated successfully' })
                };

            case 'PUT':
                const updateData = JSON.parse(body);
                await adjustInventory(updateData, inventoryTable);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Inventory adjusted successfully' })
                };
        }

        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid request' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};

async function getMedicineInventory(medicineId, tableName) {
    const params = {
        TableName: tableName,
        KeyConditionExpression: 'medicineId = :mid',
        ExpressionAttributeValues: {
            ':mid': medicineId
        }
    };

    const result = await dynamodb.query(params).promise();
    return result.Items;
}

async function updateInventory(data, inventoryTable, medicinesTable) {
    const { medicineId, batchId, quantity, expiryDate } = data;

    // First verify if medicine exists
    const medicineParams = {
        TableName: medicinesTable,
        Key: {
            medicineId: medicineId
        }
    };

    const medicine = await dynamodb.get(medicineParams).promise();
    if (!medicine.Item) {
        throw new Error('Medicine not found');
    }

    // Update inventory
    const params = {
        TableName: inventoryTable,
        Item: {
            medicineId,
            batchId,
            quantity,
            expiryDate,
            lastUpdated: new Date().toISOString()
        }
    };

    await dynamodb.put(params).promise();
}

async function adjustInventory(data, tableName) {
    const { medicineId, batchId, adjustment } = data;

    const params = {
        TableName: tableName,
        Key: {
            medicineId,
            batchId
        },
        UpdateExpression: 'set quantity = quantity + :adj, lastUpdated = :now',
        ExpressionAttributeValues: {
            ':adj': adjustment,
            ':now': new Date().toISOString()
        },
        ReturnValues: 'UPDATED_NEW'
    };

    await dynamodb.update(params).promise();
}