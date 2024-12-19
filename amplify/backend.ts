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
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";


const backend = defineBackend({
  auth,
  data,
  storage,
  statisticsFunction,
});

// Create API stack
const apiStack = backend.createStack("api-stack");

// Create REST API
const statisticsApi = new RestApi(apiStack, "StatisticsApi", {
  restApiName: "statisticsApi",
  deploy: true,
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
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
    API: statisticsApi.url, // Ensure the API's URL is set as an output
  },
};