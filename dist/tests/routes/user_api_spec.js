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
// import app to use in testing
const server_1 = __importDefault(require("../../server"));
// import supertest to test http requests
const supertest_1 = require("supertest");
//import jwt to verify tokens
const jwt = __importStar(require("jsonwebtoken"));
// import dotenv to use environmental variables
const dotenv_1 = __importDefault(require("dotenv"));
// import User type and UserStore class
const user_1 = require("../../models/user");
// import DbSetup class to setup database
const dbSetup_1 = require("../utilities/dbSetup");
describe('USER API TESTING', () => {
    // get TOKEN_SECRET from enviromental variables
    dotenv_1.default.config();
    const TOKEN_SECRET = process.env.TOKEN_SECRET;
    const dbSetup = new dbSetup_1.DbSetup();
    let adminToken = '';
    let userToken = '';
    beforeAll(async () => {
        // setup database for testing
        await dbSetup.setup();
        // get token for an admin and a regular user
        const userStore = new user_1.UserStore();
        adminToken = (await userStore.authenticate(dbSetup.admin.username, dbSetup.admin.password));
        userToken = (await userStore.authenticate(dbSetup.user.username, dbSetup.user.password));
    });
    // TEST POST /users
    it('POST /users - Creates user and returns Json Web Token', (done) => {
        // new user to add
        const newUser = {
            id: dbSetup.users.length + 1,
            username: 'newUser',
            firstname: 'New',
            lastname: 'User',
            password: '1234',
            user_type: 'regular',
        };
        (0, supertest_1.agent)(server_1.default)
            .post('/users')
            .send(newUser)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
            // token received
            const token = response.body;
            // console.log(`TOKEN RECEIVED:\n ${token}`);
            // get user details from token
            const userObject = jwt.verify(token, TOKEN_SECRET);
            // check username id token
            expect(userObject.id).toEqual(newUser.id);
            done();
        })
            .catch((Error) => {
            Error ? fail() : done();
            console.log(Error);
        });
    });
    // TEST GET /users
    it('GET /users - Returns list of users to admin user', (done) => {
        (0, supertest_1.agent)(server_1.default)
            .get('/users')
            // send admin token
            .set('Authorization', 'Bearer' + adminToken)
            .expect(200)
            .then((response) => {
            expect(response.body.length).toEqual(dbSetup.users.length + 1);
            done();
        })
            .catch((err) => {
            console.log(err);
            done.fail();
        });
    });
    it('GET /users - Returns 401 status code if requested by regular user', (done) => {
        (0, supertest_1.agent)(server_1.default)
            .get('/users')
            .set('Authorization', 'Bearer' + userToken)
            .expect(401)
            .end((err) => {
            err ? done.fail(err) : done();
        });
    });
    // TEST GET/users/:id
    it('GET /users/userId - Lets user see its own details', (done) => {
        (0, supertest_1.agent)(server_1.default)
            .get(`/users/${dbSetup.user.id}`)
            // send token to endpoint
            .set('Authorization', 'Bearer' + userToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
            expect((response.body.user_id = dbSetup.user.id));
            done();
        })
            .catch((err) => {
            console.log(`Error: ${err}`);
            done.fail();
        });
    });
    it("GET /users/userId - Refuses to show a user's info of other regular users", (done) => {
        (0, supertest_1.agent)(server_1.default)
            // ask for details of newly created user
            .get(`/users/${dbSetup.users.length + 1}`)
            // send token to endpoint use token of dbSetup's regular user
            .set('Authorization', 'Bearer' + userToken)
            .expect(401)
            .end((err) => {
            err ? done.fail(err) : done();
        });
    });
    it("GET /users/id - Lets admin see any user's details", (done) => {
        // console.log(`ADMIN TOKEN: \n ${adminToken}`)
        (0, supertest_1.agent)(server_1.default)
            // ask for details of dbSetup's regular user
            .get(`/users/${dbSetup.user.id}`)
            // send admin token
            .set('Authorization', 'Bearer' + adminToken)
            .expect(200)
            .then((response) => {
            expect(response.body.username).toEqual(dbSetup.user.username);
            done();
        })
            .catch((err) => {
            done.fail(err);
        });
    });
});
