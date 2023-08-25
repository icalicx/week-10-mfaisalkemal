import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../models/database';
import Transfer from '../models/transferModels';
import { ObjectId } from 'mongodb';
import { plainToClass } from 'class-transformer';
import Token from '../models/tokenModels';

const saltRounds = 10;
const secretKey = 'TUJUH-belas-agustus-tahun-45-itulah-hari-kemerdekaan-KITA';

export const transfer = async (req: Request, res: Response) => {
    try {
        const { amount, currency, sourceAccount, destinationAccount } = req.body;

        console.log(req.headers.authorization);
        const token = req.headers.authorization + " ";
        const tokenSliced = token?.slice(7, -1);

        if (!tokenSliced) {
            return res.status(401).json({ error: 'Authorization token not provided.' });
        }

        jwt.verify(tokenSliced, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token.' });
            }

            const status = 'pending';
            const createdAt = new Date();

            const transfer = new Transfer(amount, currency, sourceAccount, destinationAccount, status, createdAt);

            const db = getDb();
            await db.collection('transfers').insertOne(transfer);

            res.status(201).json({ message: 'Transfer initiated successfully.' });
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while initiating the transfer.' });
    }
};

export const updateTransferStatus = async (req: Request, res: Response) => {
    try {
        const transferId = req.params.id;
        const newStatus = req.body.status;

        const token = req.headers.authorization + " ";
        const tokenSliced = token?.slice(7, -1);

        if (!tokenSliced) {
            return res.status(401).json({ error: 'Authorization token not provided.' });
        }

        jwt.verify(tokenSliced, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token.' });
            };

            const loadedToken = plainToClass (Token, decoded);

            if (loadedToken.role !== 'approver') {
                return res.status(403).json({ error: 'Permission denied. Only approvers can change status.' });
            }   

            const db = getDb()
            const result = await db.collection('transfers').updateOne(
                { _id: new ObjectId(transferId), status: 'pending' },
                { $set: { status: newStatus, updatedAt: new Date() } }
            );

            if (result.modifiedCount === 1) {
                res.status(200).json({ message: 'Transfer status updated successfully.' });
            } else {
                res.status(404).json({ error: 'Transfer not found or status is not pending.' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating transfer status.' });
    }
};


export const getAllTransfers = async (req: Request, res: Response) => {
    try {

        const token = req.headers.authorization + " ";
        const tokenSliced = token?.slice(7, -1);

        if (!tokenSliced) {
            return res.status(401).json({ error: 'Authorization token not provided.' });
        }

        jwt.verify(tokenSliced, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token.' });
            }

            const loadedToken = plainToClass (Token, decoded);

            if (loadedToken.role !== 'maker' && loadedToken.role !== 'approver') {
                return res.status(403).json({ error: 'Permission denied. Only makers and approvers can access.' });
            }

            const db = getDb();
            const transfers = await db.collection('transfers').find({}).toArray();

            const transfersWithLocalTime = transfers.map(transfer => {
                
                const createdAtLocalTime = new Date(transfer.createdAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
                const updatedAtLocalTime = transfer.updatedAt ? new Date(transfer.updatedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }) : null;
                return { ...transfer, createdAtLocalTime, updatedAtLocalTime, createdAt: undefined, updatedAt: undefined };
            });

            res.status(200).json(transfersWithLocalTime);
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching transfers.' });
    }
};
