"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const database_1 = require("./models/database");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use('/', authRoutes_1.default);
(0, database_1.connectDb)().then(() => {
    app.listen(3000, () => {
        console.log(`Server is running on port 3000`);
    });
});
