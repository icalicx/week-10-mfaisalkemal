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

app.use('/', authRoutes);

connectDb().then(() => {
    app.listen(3000, () => {
        console.log(`Server is running on port 3000`);
    });
});