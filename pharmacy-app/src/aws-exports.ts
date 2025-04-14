const awsmobile = {
    "aws_project_region": process.env.REGION || "us-east-1",
    "aws_cognito_region": process.env.REGION || "us-east-1",
    "aws_user_pools_id": process.env.COGNITO_USER_POOL_ID,
    "aws_user_pools_web_client_id": process.env.COGNITO_CLIENT_ID,
    "oauth": {},
    "aws_appsync_graphqlEndpoint": process.env.APPSYNC_API_URL,
    "aws_appsync_region": process.env.REGION || "us-east-1",
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS"
};

export default awsmobile;
