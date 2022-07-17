import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProductsByIdService } from '../../services/products';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  const { productId } = event.pathParameters;
  const product = getProductsByIdService(productId);

  return formatJSONResponse({
    data: product,
  });
};

export const main = middyfy(getProductsById);
