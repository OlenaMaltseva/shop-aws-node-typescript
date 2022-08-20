export const GET_PRODUCTS_LIST =`SELECT p.id, p.title, p.description, p.price, p.image, s.count 
    FROM products AS p 
    JOIN stocks AS s 
    ON p.id = s.product_id`;
export const GET_PRODUCT_BY_ID_QUERY = `${GET_PRODUCTS_LIST} WHERE p.id = $1`;
export const CREATE_PRODUCT_QUERY = `INSERT INTO products(title, price, description, image)
    VALUES($1,$2,$3, $4)
    RETURNING *`;
export const CREATE_STOCK_QUERY = `INSERT INTO stocks(product_id, count)
    VALUES($1,$2)
    RETURNING count`;