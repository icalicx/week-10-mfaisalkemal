"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
const openApiValidator = require("express-openapi-validator");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const openApiPath = './doc/openapi.yaml';
const file = fs_1.default.readFileSync(openApiPath, 'utf8');
const swaggerDocument = js_yaml_1.default.load(file);
app.use('/swaggeropenapi', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use(openApiValidator.middleware({
    apiSpec: openApiPath,
    validateRequests: true
}));
app.use('/', authRoutes_1.default);
app.listen(3000);
