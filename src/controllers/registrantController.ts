import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Registrant from '../models/registrantModels';
import { getDb } from '../models/database';

const saltRounds = 10;
const secretKey = 'TUJUH-belas-agustus-tahun-45-itulah-hari-kemerdekaan-KITA';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, role, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const registrant = new Registrant(username, role, hashedPassword);

        const db = getDb();
        const userName = await db.collection('registrants').distinct('username');
        
        let i: number;
        let counter = 0;

        if( userName.length == 0 ){
            await db.collection('registrants').insertOne(registrant);
        }

        for( i = 0; i < userName.length; i++){
            
            if( userName[i] == registrant.username ){
                return res.status(409).json({ error: 'Username already exist.' });
                break;
            }
            else {
                counter++;
            }
            if(counter == userName.length){
                await db.collection('registrants').insertOne(registrant);
            }
        }

        res.status(201).json({ message: 'Member registered successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while registering.' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const db = getDb();
        const registrantData = await db.collection('registrants').findOne({ username });

        if (!registrantData) {
            return res.status(401).json({ error: 'Authentication failed.' });
        }

        const passwordMatch = await bcrypt.compare(password, registrantData.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed.' });
        }

        const token = jwt.sign(
            { username: registrantData.username, role: registrantData.role },
            secretKey
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while logging in.' });
    }
};