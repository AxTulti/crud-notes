"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); //we are going to verify the signature in the middlware
const dotenv_1 = require("dotenv");
dotenv_1.config();
/*
 * Theese are validations intended to be used
 * as middleware for the different routes.
 */
function verifyIfThereIsToken(req) {
    // This route verifies that there is a token in the request body, and it is a string.
    if (typeof req.body.token !== 'string')
        return false;
    return true;
}
function verifyToken(req, res, next) {
    /* This route verifys the following:
     * 1. There is a token in the request body.
     * 2. The token is signed by the authenticating server.
     * 3. The token is still valid.
     * 4. The token is appended to the request.token property.
     */
    // 1. There is a token in the request body.
    const isThereATokenInBody = verifyIfThereIsToken(req);
    // 401 Unauthorized
    if (!(isThereATokenInBody))
        return res.status(401).send('No token found in the request body. Or it is not a string');
    // 2. The token is signed by the authenticating server.
    const { token } = req.body;
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        // 3. The token is still valid.
        // 401 Unauthorized
        if (err)
            return res.status(401).json(err);
        // if the token gets here, it means that the token is valid.
        // 4. The token is appended to the request.token property.
        req.token = decoded;
        next();
    });
}
exports.verifyToken = verifyToken;
