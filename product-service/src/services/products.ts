import products from './mock-products-list.json';

export interface IProduct {
    id: string,
    price: number,
    title: string,
    image: string,
    stock: number,
    description: string,
}

export type Product = {
    price: number;
    title: string;
    image: string;
    stock: number;
    description: string;
}

export const getProductsByIdService = ( id: string ): Product => products.find( product => product.id === id );

export const getProductsListService = (): IProduct[] => products;