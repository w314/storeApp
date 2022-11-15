"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
// intializing the environment variables
dotenv_1.default.config();
const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, POSTGRES_DB_TEST, POSTGRES_USER, POSTGRES_PASSWORD, ENV, } = process.env;
// declare client
const client = new pg_1.Pool({
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT),
    database: ENV === 'dev' ? POSTGRES_DB : POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
});
// console.log(`CLIENT:\n ${JSON.stringify(client, null, 4)}`)
exports.default = client;
