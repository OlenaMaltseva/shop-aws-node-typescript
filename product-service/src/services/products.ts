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
            const result = await dbClient.query(GET_PRODUCT_BY_ID_QUERY,[id]);
   
            return result.rows.length ? result.rows[0] : null;
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
            const productCreateResult = await dbClient.query(
                CREATE_PRODUCT_QUERY,
                [product.title,product.price,product.description,product.image]
            );
            const [productItem] = productCreateResult.rows;
            console.log('productCreateResult',productItem);
            
    
            console.log('Added product with id', productItem.id);

            const stockCreateResult = await dbClient.query(
                CREATE_STOCK_QUERY, 
                [ productItem.id, product.count ]
            )
            console.log('stockCreateResult',stockCreateResult);
            await dbClient.query('COMMIT');
    
            return { ...productItem, count: product.count};
        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log('ROLLBACK',error);
        
        } finally {
            dbClient?.end();
        }
    };
}

export default new ProductService()