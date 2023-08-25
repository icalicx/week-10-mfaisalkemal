import { ObjectId } from 'mongodb';

export default class Transfer {
    constructor(
        public amount: number,
        public currency: string,
        public sourceAccount: string,
        public destinationAccount: string,
        public status: string,
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}
}