import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productService, { ProductDetails } from '../../services/products'; 

const validateCreateProductPayload = async(payload) => {
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
    console.log(`createProduct invoked with params: ${JSON.stringify(event.body)}`)

    const payload = event.body as ProductDetails;
    console.log('payload',payload);
    

    const { isValid, errors, productData } = await validateCreateProductPayload(payload);

    const product = await productService.createProduct(productData);
    if(!isValid) {
      return {
        message: 'Not valid product data provided',
        errors
      }
    }
      return formatJSONResponse({product});

  } catch (error) {
    console.log(error);    
      return error;
  }

};

export const main = middyfy(createProduct);
