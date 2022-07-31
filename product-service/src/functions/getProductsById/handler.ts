import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProductsByIdService } from '../../services/products';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product = getProductsByIdService(productId);
    if(product) {
      console.log(`getProductsById invoked with productId: ${event.pathParameters.productId}, the product is ${event.body}`)

      return formatJSONResponse({
        data: product,
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
