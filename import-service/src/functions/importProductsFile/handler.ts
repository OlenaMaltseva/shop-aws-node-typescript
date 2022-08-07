import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';
// import importService from '../../services/import'; 

const s3 = new S3();

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  try{

    const importFileName = event.queryStringParameters?.name;
    // const importFileName = await importService.importProductsFile(); //TODO separate import service
    console.log(`getProductsList invoked: ${new Date().toLocaleTimeString()} with result of ${importFileName} imported products`);

    if(!importFileName) {
      throw new Error('query param name is missing');
    }

    const signedURL = await s3.getSignedUrl('putObject', {
      Bucket: 'bookshop-products',
      Key: `uploaded/${importFileName}`,
      Expires: 60,
      ContentType: 'text/csv'
    })

    return formatJSONResponse({ signedURL });
  } catch (error) {
    console.log('Error while getting the products list', error);    
  }
  
};

export const main = middyfy(importProductsFile);
