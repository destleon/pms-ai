# Pharmacy App Deployment Guide

This guide provides instructions for deploying the Pharmacy App using either AWS Amplify or AWS CloudFormation.

## Prerequisites

- Node.js 18.x or later
- AWS CLI configured with appropriate credentials
- AWS Amplify CLI installed (`npm install -g @aws-amplify/cli`)
- Git repository set up

## Option 1: Deployment with AWS Amplify

### 1. Initialize Amplify

```bash
cd newai
amplify init
```

Follow the prompts to configure your project:
- Choose your environment name (e.g., dev, prod)
- Choose your default editor
- Choose "AWS profile" for authentication

### 2. Configure Frontend

```bash
cd pharmacy-app
npm install
```

### 3. Push Amplify Configuration

```bash
amplify push
```

This will create all necessary backend resources.

### 4. Deploy Frontend

You can deploy the frontend in two ways:

#### A. Using Amplify Console (Recommended)

1. Go to AWS Amplify Console
2. Click "New app" > "Host web app"
3. Connect your repository
4. Select the branch to deploy
5. Confirm the build settings (they are already configured in amplify.yml)
6. Click "Save and deploy"

#### B. Using Amplify CLI

```bash
amplify publish
```

## Option 2: Deployment with CloudFormation

### 1. Prepare the Infrastructure

The CloudFormation template is located in `infrastructure/template.yaml`. It sets up:
- Amplify application
- Deployment configuration
- Required IAM roles
- Environment variables

### 2. Deploy Using CloudFormation

1. Update the repository URL in the template:
   Open `infrastructure/template.yaml` and replace `YOUR_REPOSITORY_URL` with your actual repository URL.

2. Deploy the stack:
```bash
aws cloudformation create-stack \
  --stack-name pharmacy-app-stack \
  --template-body file://infrastructure/template.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=dev \
    ParameterKey=BranchName,ParameterValue=main \
  --capabilities CAPABILITY_IAM
```

3. Monitor the deployment:
```bash
aws cloudformation describe-stacks --stack-name pharmacy-app-stack
```

## Post-Deployment Steps

1. Configure environment variables in Amplify Console if needed
2. Set up custom domains if required
3. Configure build notifications

## Project Structure

```
newai/
├── amplify/           # Amplify backend configuration
├── pharmacy-app/      # Frontend React application
│   ├── src/          # Source code
│   └── ...
├── infrastructure/    # CloudFormation templates
└── amplify.yml       # Amplify build configuration
```

## Environment Variables

The following environment variables need to be configured in your deployment:

- `NODE_ENV`: Environment name (dev/prod)
- Add any additional environment variables your application needs

## Monitoring and Maintenance

1. Monitor the application through AWS CloudWatch
2. Set up alarms for important metrics
3. Regular backup of data
4. Monitor build and deployment logs in Amplify Console

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

## Security Considerations

1. Always use environment variables for sensitive information
2. Regularly rotate AWS access keys
3. Use least privilege principle for IAM roles
4. Enable WAF for production deployments
5. Configure CORS appropriately

## Support

For issues and support:
1. Check AWS Amplify documentation
2. Review CloudFormation documentation
3. Contact AWS Support if needed

## License

[Your License Information]