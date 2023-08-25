"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registrantModels_1 = __importDefault(require("../models/registrantModels"));
const database_1 = require("../models/database");
const saltRounds = 10;
const secretKey = 'TUJUH-belas-agustus-tahun-45-itulah-hari-kemerdekaan-KITA';
const register = async (req, res) => {
    try {
        const { username, role, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const registrant = new registrantModels_1.default(username, role, hashedPassword);
        const db = (0, database_1.getDb)();
        const userName = await db.collection('registrants').distinct('username');
        let i;
        let counter = 0;
        if (userName.length == 0) {
            await db.collection('registrants').insertOne(registrant);
        }
        for (i = 0; i < userName.length; i++) {
            if (userName[i] == registrant.username) {
                return res.status(409).json({ error: 'Username already exist.' });
                break;
            }
            else {
                counter++;
            }
            if (counter == userName.length) {
                await db.collection('registrants').insertOne(registrant);
            }
        }
        res.status(201).json({ message: 'Member registered successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while registering.' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = (0, database_1.getDb)();
        const registrantData = await db.collection('registrants').findOne({ username });
        if (!registrantData) {
            return res.status(401).json({ error: 'Authentication failed.' });
        }
        const passwordMatch = await bcrypt_1.default.compare(password, registrantData.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed.' });
        }
        const token = jsonwebtoken_1.default.sign({ username: registrantData.username, role: registrantData.role }, secretKey);
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while logging in.' });
    }
};
exports.login = login;
