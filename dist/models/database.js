"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.connectDb = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const url = "mongodb+srv://mfaisalkemal:Hgfh7DiW8Kkub6yN@mfaisalkemal.pzizaup.mongodb.net/?retryWrites=true&w=majority";
const dbName = "week-10-mfaisalkemal";
let db;
const connectDb = async () => {
    const client = new mongodb_1.MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to the database');
        db = client.db(dbName);
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
    }
};
exports.connectDb = connectDb;
const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};
exports.getDb = getDb;
