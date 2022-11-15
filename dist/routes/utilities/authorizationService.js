"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = void 0;
// import dotenv to use environmental variables
const dotenv_1 = __importDefault(require("dotenv"));
// import jwt to verify tokens
const jwt = __importStar(require("jsonwebtoken"));
class Authenticate {
    // this method can be called to authenticate users
    static verify(role) {
        // the method will returns this function
        return async (req, res, next) => {
            // if token is  invalid
            if (!this.verifyToken(req, res)) {
                console.log('Invalid token.');
                res.status(401);
                res.json('Invalid token');
                return;
            }
            // if role is admin but user is not admin
            if (role === 'admin' && res.locals.user.user_type != 'admin') {
                console.log('User has to be admin for this action');
                res.status(401);
                res.json('User has to be admin for this action');
                return;
            }
            // if role is self but user is not self OR admin
            if (role === 'self' &&
                !(res.locals.user.id === parseInt(req.params.userId) ||
                    res.locals.user.user_type === 'admin')) {
                console.log('Users can only acces their own records.');
                res.status(401);
                res.json('Users can only acces their own records.');
                return;
            }
            // there was no problem in authentication, call next function
            return next();
        };
    }
}
exports.Authenticate = Authenticate;
Authenticate.verifyToken = (req, res) => {
    // initialize environmental variables
    dotenv_1.default.config();
    const TOKEN_SECRET = process.env.TOKEN_SECRET;
    try {
        // get token from request header
        const authorizationHeader = req.headers.authorization;
        // remove word "Bearer" from authorizationHeader string
        const token = authorizationHeader.slice(6);
        // verify user
        const user = jwt.verify(token, TOKEN_SECRET);
        // store user
        res.locals.user = user;
        return true;
    }
    catch (err) {
        return false;
    }
};
