import { Client } from 'pg';
import envCreds from '../../env';

export const createConnectionClient = async() => {
    const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = envCreds;

    const dbOptions = {
        host: PG_HOST,
        port: Number(PG_PORT),
        database: PG_DATABASE,
        user: PG_USERNAME,
        password: PG_PASSWORD,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
    };    

    const dbClient = new Client(dbOptions);
    await dbClient.connect();

    return dbClient;  
}

