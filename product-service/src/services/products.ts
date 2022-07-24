import products from './mock-products-list.json';

export interface IProduct {
    id: string,
    price: number,
    title: string,
    image: string,
    count: number,
    description: string,
}


export const getProductsByIdService = ( id: string ): IProduct => products.find( product => product.id === id );

export const getProductsListService = (): IProduct[] => products;