import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productService from '../../services/products'; 

const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  try{
    const products = await productService.getProductsList();
    console.log(`getProductsList invoked: ${new Date().toLocaleTimeString()} with result of ${products.length} products`)

    return formatJSONResponse({ products });
  } catch (error) {
    console.log('Error while getting the products list', error);    
  }

};

export const main = middyfy(getProductsList);
