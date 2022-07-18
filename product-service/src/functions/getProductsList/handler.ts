import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProductsListService } from '../../services/products';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  const products = getProductsListService();

  return formatJSONResponse({
    data: products,
  });
};

export const main = middyfy(getProductsList);
