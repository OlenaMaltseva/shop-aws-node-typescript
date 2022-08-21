import type { AWS } from '@serverless/typescript';
import { createProduct, getProductsById, getProductsList } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'shop-product-service-5',
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-esbuild',
    'serverless-dotenv-plugin',
    'serverless-offline'
  ],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'honeybadgerAdmin',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_DATABASE: process.env.PG_DATABASE,
      PG_USERNAME: process.env.PG_USERNAME,
      PG_PASSWORD: process.env.PG_PASSWORD
    },
  },
  functions: {
    createProduct,
    getProductsList,
    getProductsById 
  },
  package: { individually: true },
  custom: {
    dotenv: {
      path: './env',
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      external: ['pg-native']
    },
    autoswagger: {
      title: 'Products',
      typefiles: ['./src/services/products.ts'],
      host: '0p91e56xa0.execute-api.us-east-1.amazonaws.com/dev/',
      schemes: ['https'],
      useStage: true,
    }
  },
};

module.exports = serverlessConfiguration;
