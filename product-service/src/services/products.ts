import { createConnectionClient } from 'src/db/client-connector';
import { CREATE_PRODUCT_QUERY, CREATE_STOCK_QUERY, GET_PRODUCTS_LIST, GET_PRODUCT_BY_ID_QUERY } from 'src/db/db_queries';

export interface IProduct {
    id: string,
    price: number,
    title: string,
    image: string,
    count: number,
    description: string,
}

export const getProductsByIdService = async ( id: string ): Promise<IProduct> => {
    let dbClient;

    try {
        dbClient = await createConnectionClient();
        const result = await dbClient.query(GET_PRODUCT_BY_ID_QUERY[id]);
        console.log('getProductsByIdService query result', result);

        return result.rows?.[0] || null;
    } finally {
        dbClient?.end();
    }
};


export const getProductsListService = async() => {
    let dbClient;

    try {
        dbClient = await createConnectionClient();
        const result = await dbClient.query(GET_PRODUCTS_LIST);

        return result;
    } finally {
        dbClient?.end();
    }
};


export const createProductService = async (product: IProduct): Promise<IProduct> => {
    let dbClient;

    try {
        dbClient = await createConnectionClient();

        await dbClient.query('BEGIN');
        const result = await dbClient.query(
            CREATE_PRODUCT_QUERY,
            [product.title, product.price, product.description || '', product.image || '']
        );

        console.log('Added product', result);

        const [ data ] = result.rows;

        await dbClient.query(
            CREATE_STOCK_QUERY,
            [data.id, product.count]
        )
        
        await dbClient.query('COMMIT');

        return { ...data, ...product};
    } finally {
        dbClient?.end();
    }
};
