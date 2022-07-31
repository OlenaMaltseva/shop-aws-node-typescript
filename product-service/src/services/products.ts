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

        return result;
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

        const [ data ] = result;
        await dbClient.query(
            CREATE_STOCK_QUERY,
            [data.id, product.count]
        )
        

        return result;
    } finally {
        dbClient?.end();
    }
};
