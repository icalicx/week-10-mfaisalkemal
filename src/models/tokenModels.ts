export default class Token {
    constructor(
        public username: string,
        public role: string,
        public iat: number
    ) {}
}