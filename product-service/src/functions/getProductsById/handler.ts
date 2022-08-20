import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productService from '../../services/products'; 

const getProductsById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product = await productService.getProductsById(productId);
    console.log('product', product);
    
    if(!!product) {
      console.log(`getProductsById invoked with productId: ${event.pathParameters.productId}, the product is ${event.body}`)

      return formatJSONResponse({
        product,
      });
    }

    return formatJSONResponse({
      statusCode: 404,
      message: "Product not found!",
    });
  } catch (error) {  
      return error;
  }

};

export const main = middyfy(getProductsById);
