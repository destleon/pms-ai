const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const { reportType, startDate, endDate } = JSON.parse(event.body);
        const salesTable = process.env.SALES_TABLE;
        const inventoryTable = process.env.INVENTORY_TABLE;

        let report;
        switch (reportType) {
            case 'sales':
                report = await generateSalesReport(startDate, endDate, salesTable);
                break;
            case 'inventory':
                report = await generateInventoryReport(inventoryTable);
                break;
            case 'low-stock':
                report = await generateLowStockReport(inventoryTable);
                break;
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid report type' })
                };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(report)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};

async function generateSalesReport(startDate, endDate, tableName) {
    const params = {
        TableName: tableName,
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

    const result = await dynamodb.query(params).promise();
    const sales = result.Items;

    // Calculate summary statistics
    const summary = {
        totalSales: sales.length,
        totalRevenue: sales.reduce((sum, sale) => sum + sale.total, 0),
        averageTransactionValue: 0,
        salesByDate: {}
    };

    summary.averageTransactionValue = summary.totalRevenue / summary.totalSales;

    // Group sales by date
    sales.forEach(sale => {
        if (!summary.salesByDate[sale.date]) {
            summary.salesByDate[sale.date] = {
                count: 0,
                revenue: 0
            };
        }
        summary.salesByDate[sale.date].count++;
        summary.salesByDate[sale.date].revenue += sale.total;
    });

    return summary;
}

async function generateInventoryReport(tableName) {
    const params = {
        TableName: tableName
    };

    const result = await dynamodb.scan(params).promise();
    const inventory = result.Items;

    // Group by medicine
    const summary = {
        totalItems: inventory.length,
        totalQuantity: inventory.reduce((sum, item) => sum + item.quantity, 0),
        itemsByStock: {
            low: [],
            normal: [],
            excess: []
        }
    };

    // Categorize items by stock level
    inventory.forEach(item => {
        if (item.quantity <= item.minStock) {
            summary.itemsByStock.low.push(item);
        } else if (item.quantity <= item.maxStock) {
            summary.itemsByStock.normal.push(item);
        } else {
            summary.itemsByStock.excess.push(item);
        }
    });

    return summary;
}

async function generateLowStockReport(tableName) {
    const params = {
        TableName: tableName,
        FilterExpression: 'quantity <= minStock'
    };

    const result = await dynamodb.scan(params).promise();
    const lowStockItems = result.Items;

    return {
        totalLowStockItems: lowStockItems.length,
        items: lowStockItems.map(item => ({
            medicineId: item.medicineId,
            batchId: item.batchId,
            currentStock: item.quantity,
            minStock: item.minStock,
            requiredQuantity: item.minStock - item.quantity
        }))
    };
}