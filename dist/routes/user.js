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
// import User type and Userstore class
const user_1 = require("../models/user");
// importing jwt for creating jwt tokens
const jwt = __importStar(require("jsonwebtoken"));
// import dotenv to access environmental variables
const dotenv_1 = __importDefault(require("dotenv"));
// import verify utilities to verify user token and access
const authorizationService_1 = require("./utilities/authorizationService");
const store = new user_1.UserStore();
// initialize enrionmental variables
dotenv_1.default.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;
// create creates new user and returns a Json Web Token
const create = async (req, res) => {
    const testUser = {
        id: 0,
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        user_type: 'regular',
    };
    try {
        // create user
        const userCreated = await store.create(testUser);
        try {
            // create token for user
            const token = jwt.sign(userCreated, TOKEN_SECRET);
            // return token
            res.json(token);
        }
        catch (err) {
            res.status(500);
            res.json(err);
        }
    }
    catch (err) {
        res.sendStatus(400);
        res.json(err);
    }
};
// if valid token is provided returns list of users
const index = async (req, res) => {
    try {
        const users = await store.index();
        // console.log(`users from database: ${JSON.stringify(users, null, 4)}`);
        res.status(200);
        res.json(users);
    }
    catch (err) {
        console.log(`error: ${err}`);
        res.sendStatus(400);
        res.json(err);
    }
};
// show requires a Json Web Token and displays the user data requested
const show = async (req, res) => {
    try {
        const id = parseInt(req.params.userId);
        const user = await store.show(id);
        res.json(user);
    }
    catch (err) {
        res.sendStatus(400);
        res.json(err);
    }
};
const userRoutes = (app) => {
    app.post('/users', create);
    app.get('/users', authorizationService_1.Authenticate.verify('admin'), index);
    app.get('/users/:userId', authorizationService_1.Authenticate.verify('self'), show);
};
exports.default = userRoutes;
