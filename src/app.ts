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

connectDb().then(() => {
    app.listen(3000, () => {
        console.log(`Server is running on port 3000`);
    });
});