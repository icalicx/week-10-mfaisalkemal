"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Token {
    constructor(username, role, iat) {
        this.username = username;
        this.role = role;
        this.iat = iat;
    }
}
exports.default = Token;
