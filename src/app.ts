import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import { connectDb } from './models/database';
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import openApiValidator = require("express-openapi-validator");
import { Request, Response, NextFunction } from 'express';

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json());

const openApiPath = './doc/openapi.yaml';
const file = fs.readFileSync(openApiPath, 'utf8');
const swaggerDocument = yaml.load(file);
app.use('/swaggeropenapi', swaggerUi.serve, swaggerUi.setup(swaggerDocument!))

    app.use(openApiValidator.middleware({
        apiSpec: openApiPath,
        validateRequests: true
    }));

app.use('/', authRoutes);

app.use(( err: Error, req: Request, res: Response, next: NextFunction ) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    })
})

connectDb();
app.listen(3000);