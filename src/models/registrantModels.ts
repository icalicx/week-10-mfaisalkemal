import { ObjectId } from 'mongodb';

export default class Registrant {
    constructor(
        public username: string,
        public role: string,
        public password: string
    ) {}
}