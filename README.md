# Pharmacy App

A comprehensive pharmacy management system built with AWS Amplify and React.

## Project Overview

The Pharmacy App is a full-stack application that helps manage pharmacy inventory, sales, and customer data. It features role-based access control, real-time inventory tracking, and automated alerts for low stock and expiring medications.

## Architecture

The application uses a serverless architecture built on AWS:

- Frontend: React with TypeScript
- Backend: AWS AppSync (GraphQL API)
- Authentication: Amazon Cognito
- Database: Amazon DynamoDB
- Storage: Amazon S3
- Functions: AWS Lambda
- Monitoring: CloudWatch
- Deployment: AWS Amplify/CloudFormation

## Prerequisites

- Node.js 18.x or later
- AWS CLI configured with appropriate credentials
- AWS Amplify CLI installed (`npm install -g @aws-amplify/cli`)
- Git repository set up

## Project Structure

```
newai/
├── amplify/                 # Amplify backend configuration
│   ├── auth/               # Authentication configuration
│   ├── api/                # GraphQL API configuration
│   ├── data/              # Data models and schema
│   └── functions/         # Lambda functions
├── pharmacy-app/           # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── graphql/      # Generated GraphQL operations
│   │   ├── models/       # TypeScript interfaces
│   │   ├── utils/        # Utility functions
│   │   └── tests/        # Unit and integration tests
│   └── package.json
├── infrastructure/         # CloudFormation templates
└── amplify.yml            # Amplify build configuration
```

## Data Models

### Medicine
```typescript
interface Medicine {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  expiryDate: string;
  manufacturer: string;
  category: string;
  reorderLevel: number;
  lastUpdated: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  medicineId: string;
  quantity: number;
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  attendantId: string;
  transactionDate: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
```

### InventoryAlert
```typescript
interface InventoryAlert {
  id: string;
  medicineId: string;
  alertType: 'LOW_STOCK' | 'EXPIRING_SOON';
  message: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  isDeleted: boolean;
}
```

## API Documentation

### GraphQL Operations

#### Queries
- `listMedicines`: Fetch paginated list of medicines
- `getMedicine`: Get medicine by ID
- `searchMedicines`: Search medicines by name or category
- `listTransactions`: Fetch paginated list of transactions
- `getTransaction`: Get transaction by ID
- `listInventoryAlerts`: Fetch paginated list of alerts

#### Mutations
- `createMedicine`: Create new medicine
- `updateMedicine`: Update medicine details
- `deleteMedicine`: Soft delete medicine
- `createTransaction`: Create new transaction
- `updateTransaction`: Update transaction details
- `createInventoryAlert`: Create new inventory alert
- `resolveInventoryAlert`: Resolve an alert

#### Subscriptions
- `onMedicineUpdated`: Real-time updates for medicine changes
- `onInventoryAlertCreated`: Real-time notifications for new alerts
- `onTransactionCreated`: Real-time updates for new transactions

## Authentication and Authorization

The application uses Amazon Cognito for authentication with the following features:

- Email-based sign-up and sign-in
- Multi-factor authentication (optional)
- Password policies:
  - Minimum length: 12 characters
  - Requires numbers
  - Requires special characters
  - Requires uppercase and lowercase letters

### User Groups and Permissions

1. Admin Group
   - Full access to all operations
   - Can manage users and roles
   - Access to analytics and reports

2. Attendant Group
   - Read access to medicines
   - Can create and read transactions
   - Can update medicine quantities
   - Can create inventory alerts

## Deployment

### Option 1: AWS Amplify

1. Initialize Amplify:
```bash
cd newai
amplify init
```

2. Configure Frontend:
```bash
cd pharmacy-app
npm install
```

3. Push Amplify Configuration:
```bash
amplify push
```

4. Deploy Frontend (Amplify Console):
   - Go to AWS Amplify Console
   - Click "New app" > "Host web app"
   - Connect your repository
   - Select branch to deploy
   - Confirm build settings
   - Click "Save and deploy"

### Option 2: CloudFormation

1. Update repository URL in `infrastructure/template.yaml`

2. Deploy stack:
```bash
aws cloudformation create-stack \
  --stack-name pharmacy-app-stack \
  --template-body file://infrastructure/template.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=dev \
    ParameterKey=BranchName,ParameterValue=main \
    ParameterKey=AlertEmailEndpoint,ParameterValue=your-email@example.com \
  --capabilities CAPABILITY_IAM
```

## Monitoring and Alerts

The application uses CloudWatch for monitoring with the following alarms:

1. API Performance
   - 4XX errors > 5 in 5 minutes
   - API latency > 1000ms

2. Database
   - DynamoDB throttling events
   - Table capacity utilization > 80%

3. Authentication
   - Failed authentication attempts > 10 in 5 minutes
   - User pool changes

4. Lambda Functions
   - Error rate > 1%
   - Duration > 10 seconds

## Security Considerations

1. Data Protection
   - All data at rest is encrypted using KMS
   - Sensitive data is stored in environment variables
   - Regular data backups

2. Access Control
   - Least privilege IAM roles
   - Role-based access control
   - MFA for sensitive operations

3. Network Security
   - WAF enabled for production
   - CORS configured appropriately
   - API rate limiting

4. Compliance
   - Audit logging enabled
   - Regular security patches
   - Automated vulnerability scanning

## Development Workflow

1. Local Development
```bash
cd pharmacy-app
npm install
npm run dev
```

2. Testing
```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

3. Code Quality
```bash
# Run ESLint
npm run lint

# Run TypeScript compiler
npm run type-check
```

## Troubleshooting

Common issues and solutions:

1. Build Failures
   - Check build logs in Amplify Console
   - Verify node_modules are properly cached
   - Check for dependency conflicts

2. Backend Deployment Issues
   - Verify AWS credentials
   - Check CloudFormation stack events
   - Verify IAM permissions

3. Frontend Issues
   - Check browser console for errors
   - Verify API endpoints configuration
   - Check environment variables

## Support and Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## License

[Your License Information]