const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const snsTopicArn = process.env.SNS_TOPIC_ARN;

    try {
        // Process DynamoDB Stream records
        for (const record of event.Records) {
            if (record.eventName === 'MODIFY' || record.eventName === 'INSERT') {
                const newImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
                
                // Check if stock is low
                if (newImage.quantity <= newImage.minStock) {
                    // Get medicine details
                    const medicineDetails = await getMedicineDetails(newImage.medicineId);
                    
                    // Prepare alert message
                    const message = {
                        medicineId: newImage.medicineId,
                        medicineName: medicineDetails.name,
                        currentStock: newImage.quantity,
                        minStock: newImage.minStock,
                        batchId: newImage.batchId,
                        timestamp: new Date().toISOString()
                    };

                    // Publish to SNS
                    await sns.publish({
                        TopicArn: snsTopicArn,
                        Message: JSON.stringify(message),
                        Subject: `Low Stock Alert: ${medicineDetails.name}`
                    }).promise();
                }
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Alerts processed successfully' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error processing alerts' })
        };
    }
};

async function getMedicineDetails(medicineId) {
    const params = {
        TableName: process.env.MEDICINES_TABLE,
        Key: {
            medicineId: medicineId
        }
    };

    const result = await dynamodb.get(params).promise();
    return result.Item;
}