import type { AWS } from '@serverless/typescript';
import { basicAuthorizer  } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'shop-authorization-service-7',
  frameworkVersion: '3',
  plugins: [
    // 'serverless-auto-swagger',
    'serverless-esbuild',
    'serverless-dotenv-plugin',
    'serverless-offline'
  ],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'honeybadgerAdmin',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: { basicAuthorizer },
  resources: {
    Outputs: {
      BasicAuthorizerArn: {
        Value: {
          "Fn::GetAtt": ["BasicAuthorizerLambdaFunction", "Arn"],
        }
      }
    }
  },
  package: { individually: true },
  // resources: ,
  custom: {
    // dotenv: {
    //   path: './env',
    // },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      // external: ['pg-native']
    },
    autoswagger: {
      title: 'Import Service',
      typefiles: ['./src/services/import.ts'],
      // host: '8q48nwbvhd.execute-api.us-east-1.amazonaws.com/dev/',
      schemes: ['https'],
      useStage: true,
    }
  },
};

module.exports = serverlessConfiguration;
