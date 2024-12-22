import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import {storage} from "./storage/resource"
import { statisticsFunction } from './functions/statistics/resource';
import { Stack } from "aws-cdk-lib";

import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";


const backend = defineBackend({
  auth,
  data,
  storage,
  statisticsFunction,
});

backend.statisticsFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'dynamodb:GetItem',
      'dynamodb:Query',
      'dynamodb:Scan'
    ],
    
    resources: ['*']
  })
);



// Create API stack
const apiStack = backend.createStack("api-stack");


// Add DynamoDB permissions to the Lambda function
backend.statisticsFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['dynamodb:Scan'],
    resources: ['*'] // In production, restrict this to your specific table
  })
);

// Create REST API
const statisticsApi = new RestApi(apiStack, "StatisticsApi", {
  restApiName: "statisticsApi",
  deploy: true,
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions:  {
    allowOrigins: ['*'], 
    allowMethods: ['GET', 'OPTIONS'],
    allowHeaders: ['*'],
    allowCredentials: true
  }
});

// Create Lambda integration
const lambdaIntegration = new LambdaIntegration(
  backend.statisticsFunction.resources.lambda
);

// Create statistics endpoint
const statisticsPath = statisticsApi.root.addResource("statistics");
statisticsPath.addMethod("GET", lambdaIntegration, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: new CognitoUserPoolsAuthorizer(apiStack, "StatisticsCognitoAuth", {
    cognitoUserPools: [backend.auth.resources.userPool],
  }),
});

// Create and attach IAM policy
const apiPolicy = new Policy(apiStack, "StatisticsApiPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["execute-api:Invoke"],
      resources: [statisticsApi.arnForExecuteApi("GET", "/statistics", "dev")],
    }),
  ],
});

// Attach policy to authenticated role
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(apiPolicy);


// Add outputs
backend.addOutput({
  custom: {
    API: {
      [statisticsApi.restApiName]: {
        endpoint: statisticsApi.url,
        region: Stack.of(statisticsApi).region,
        apiName: statisticsApi.restApiName,
      },
    },
  },
});

export const outputs = {
  custom: {
    API: statisticsApi.url, 
  },
};