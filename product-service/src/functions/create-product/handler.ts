import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { createProductService, IProduct } from '../../services/products';

const validateCreateProductPayload = (payload) => {
  const errors = [];
  let isValid = true;

  if(!payload.title?.trim()) {
    isValid = false;
    errors.push({
      field: 'title',
      error: 'title required'
    })
  }
  if(!payload.price) {
    isValid = false;
    errors.push({
      field: 'price',
      error: 'price required and should be bigger then 0'
    })
  }

  if(!payload.count) {
    isValid = false;
    errors.push({
      field: 'count',
      error: 'count for required and should be bigger then 0'
    })
  }

  return {
    isValid,
    errors,
    ...(isValid && { productData: { ...payload }})
  }

}

const createProduct = async (event) => {
  try {
    console.log(`createProduct invoked with params: ${event.body}`)

    const { payload } = JSON.parse(event.body);
    console.log(payload);
    

    const { isValid, errors, productData } = validateCreateProductPayload(payload);

    const product = await createProductService(productData);
    if(!isValid) {
      return {
        message: 'Not valid prodcut data provided',
        errors
      }
    }

    if(product) {
      return formatJSONResponse({
        data: product,
      });
    }
  } catch (error) {
    console.log(error);    
      return error;
  }

};

export const main = middyfy(createProduct);
