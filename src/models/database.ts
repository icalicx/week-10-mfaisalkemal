import { MongoClient, Db } from 'mongodb';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

// const url = "mongodb+srv://mfaisalkemal:Hgfh7DiW8Kkub6yN@mfaisalkemal.pzizaup.mongodb.net/?retryWrites=true&w=majority";
// const dbName = "week-10-mfaisalkemal";

const url = process.env.MONGODB_URL || '';
const dbName = "week-10-mfaisalkemal";

let db: Db;

export const connectDb = async () => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to the database');
        db = client.db(dbName);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

export const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};