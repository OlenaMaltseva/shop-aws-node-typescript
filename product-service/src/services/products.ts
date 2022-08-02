import { createConnectionClient } from 'src/db/client-connector';
import { CREATE_PRODUCT_QUERY, CREATE_STOCK_QUERY, GET_PRODUCTS_LIST, GET_PRODUCT_BY_ID_QUERY } from 'src/db/db_queries';

export interface IProduct {
    id: string,
    price: number,
    title: string,
    image?: string,
    count: number,
    description?: string,
}

export interface ProductDetails {
    price: number,
    title: string,
    image?: string,
    count: number,
    description?: string,
}

class ProductService {
    public async getProductsById ( id: string ): Promise<IProduct> {
        let dbClient;
    
        try {
            dbClient = await createConnectionClient();
            const [result] = await dbClient.query(GET_PRODUCT_BY_ID_QUERY[id]);
            console.log('getProductsByIdService query result', result.rows);
    
            return result;
        } finally {
            dbClient?.end();
        }
    };
    
    
    public async getProductsList() {
        let dbClient;
    
        try {
            dbClient = await createConnectionClient();
            const result = await dbClient.query(GET_PRODUCTS_LIST);
    
            return result.rows;
        } finally {
            dbClient?.end();
        }
    };

    public async createProduct (product: IProduct): Promise<IProduct> {
        let dbClient;
    
        try {
            dbClient = await createConnectionClient();
    
            await dbClient.query('BEGIN');
            const [productCreateResult] = await dbClient.query(
                CREATE_PRODUCT_QUERY,
                [product.title,product.price,product.description,product.image]
            );

            console.log('productCreateResult',productCreateResult);
            
    
            console.log('Added product', productCreateResult);
            const [ stockCreateResult ] = await dbClient.query(
                CREATE_STOCK_QUERY, 
                [ productCreateResult.id, product.count ]
            )
            console.log('stockCreateResult',stockCreateResult);
            await dbClient.query('COMMIT');
    
            return { ...productCreateResult, count: stockCreateResult.count};
        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error);
        } finally {
            dbClient?.end();
        }
    };
}

export default new ProductService();