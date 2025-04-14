const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const salesTable = process.env.SALES_TABLE;
    const inventoryTable = process.env.INVENTORY_TABLE;

    try {
        switch (event.httpMethod) {
            case 'POST':
                return await handleSaleCreation(event.body, salesTable, inventoryTable);
            case 'GET':
                return await handleSaleRetrieval(event.queryStringParameters, salesTable);
            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify({ message: 'Method not allowed' })
                };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};

async function handleSaleCreation(bodyStr, salesTable, inventoryTable) {
    const saleData = JSON.parse(bodyStr);
    const timestamp = new Date().toISOString();
    const saleId = `SALE_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;

    // Validate sale data
    if (!saleData.items || !Array.isArray(saleData.items) || saleData.items.length === 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid sale data' })
        };
    }

    // Calculate total
    const total = saleData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Prepare sale record
    const saleRecord = {
        saleId,
        userId: saleData.userId,
        date: timestamp.split('T')[0],
        timestamp,
        items: saleData.items,
        total,
        paymentMethod: saleData.paymentMethod
    };

    // Update inventory and create sale in transaction
    const transactionItems = [];

    // Add sale record
    transactionItems.push({
        Put: {
            TableName: salesTable,
            Item: saleRecord
        }
    });

    // Add inventory updates
    for (const item of saleData.items) {
        transactionItems.push({
            Update: {
                TableName: inventoryTable,
                Key: {
                    medicineId: item.medicineId,
                    batchId: item.batchId
                },
                UpdateExpression: 'SET quantity = quantity - :qty',
                ConditionExpression: 'quantity >= :qty',
                ExpressionAttributeValues: {
                    ':qty': item.quantity
                }
            }
        });
    }

    // Execute transaction
    await dynamodb.transactWrite({ TransactItems: transactionItems }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(saleRecord)
    };
}

async function handleSaleRetrieval(queryParams, salesTable) {
    const { startDate, endDate, userId } = queryParams || {};

    let params = {
        TableName: salesTable
    };

    if (userId) {
        params = {
            ...params,
            IndexName: 'UserIndex',
            KeyConditionExpression: 'userId = :uid',
            ExpressionAttributeValues: {
                ':uid': userId
            }
        };

        if (startDate && endDate) {
            params.KeyConditionExpression += ' AND #date BETWEEN :start AND :end';
            params.ExpressionAttributeValues = {
                ...params.ExpressionAttributeValues,
                ':start': startDate,
                ':end': endDate
            };
            params.ExpressionAttributeNames = {
                '#date': 'date'
            };
        }
    } else if (startDate && endDate) {
        params = {
            ...params,
            IndexName: 'DateIndex',
            KeyConditionExpression: '#date BETWEEN :start AND :end',
            ExpressionAttributeValues: {
                ':start': startDate,
                ':end': endDate
            },
            ExpressionAttributeNames: {
                '#date': 'date'
            }
        };
    } else {
        // Default to last 7 days
        const end = new Date().toISOString().split('T')[0];
        const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0];

        params = {
            ...params,
            IndexName: 'DateIndex',
            KeyConditionExpression: '#date BETWEEN :start AND :end',
            ExpressionAttributeValues: {
                ':start': start,
                ':end': end
            },
            ExpressionAttributeNames: {
                '#date': 'date'
            }
        };
    }

    const result = await dynamodb.query(params).promise();
    return {
        statusCode: 200,
        body: JSON.stringify(result.Items)
    };
}