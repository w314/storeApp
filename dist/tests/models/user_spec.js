"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // import model class to test and types used
const user_1 = require("../../models/user");
// import bcrypt for password encryption
const bcrypt_1 = __importDefault(require("bcrypt"));
// import dotenv to use enviromental variables
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import DbSetup class to setup database for testing
const dbSetup_1 = require("../utilities/dbSetup");
// initialize enviromental variables
dotenv_1.default.config();
const { PEPPER, TOKEN_SECRET } = process.env;
describe('User Model', () => {
    const dbSetup = new dbSetup_1.DbSetup();
    const store = new user_1.UserStore();
    const testUser = {
        id: 0,
        username: 'potter',
        firstname: 'Harry',
        lastname: 'Potter',
        password: 'patronus',
        user_type: 'regular',
    };
    beforeAll(async () => {
        // prepare database for testing
        await dbSetup.setup();
    });
    /***  test index method  ***/
    it('has index method', () => {
        expect(store.index).toBeDefined;
    });
    it('shows a list of users', async () => {
        // get list of users
        const result = await store.index();
        // console.log(result)
        expect(result.length).toEqual(dbSetup.users.length);
        expect(result[0].username).toEqual(dbSetup.users[0].username);
    });
    /***  test show method  ***/
    it('has show method', () => {
        expect(store.show).toBeDefined;
    });
    it('shows requested user', async () => {
        const result = await store.show(dbSetup.users[1].id);
        expect(result.username).toEqual(dbSetup.users[1].username);
    });
    /***  test create method  ***/
    it('has create method', () => {
        expect(store.create).toBeDefined;
    });
    it('can create user', async () => {
        // insert testUser into users table and get back created user
        const createdUser = await store.create(testUser);
        // check that createdUser detials match provided testUser input
        // expect new user to receive the next available id
        const userId = dbSetup.users.length + 1;
        expect(userId).toEqual(createdUser.id);
        // use bcrypt to compare passwords of returned created user and testUser
        expect(bcrypt_1.default.compareSync(testUser.password + PEPPER, createdUser.password))
            .toBeTrue;
        expect(testUser.username).toEqual(createdUser.username);
        expect(testUser.firstname).toEqual(createdUser.firstname);
        expect(testUser.lastname).toEqual(createdUser.lastname);
    });
    /***  test authenticate method  ***/
    it('has authenticate method', () => {
        expect(store.authenticate).toBeDefined;
    });
    it('can authenticate valid user', async () => {
        // authenticate valid user, expect a jwt token as a result
        const jwt = await store.authenticate(testUser.username, testUser.password);
        // use bcrypt to test if hashed password in result is the hash of the password provided
        if (jwt) {
            // separate payload object from jwt result (payload object contains user information)
            const verifyObj = jsonwebtoken_1.default.verify(jwt, TOKEN_SECRET);
            // expect user name returned in jwt token to match testUser's username
            expect(testUser.username).toEqual(verifyObj.username);
            // expect encrypted user password returned in jwt token match testUser's password when encrypted
            expect(bcrypt_1.default.compareSync(testUser.password + PEPPER, verifyObj.password))
                .toBeTrue;
        }
        else {
            fail('Could not validate user with valid username');
        }
    });
    it('returns null when authenticating invalid username', async () => {
        const result = await store.authenticate('invalidUserName', 'invalidPassword');
        expect(result).toBeNull;
    });
    // it('throws error when using valid username but invalid password', async () => {
    //   // try authenticate with valid username but invalid password
    //   const result = await store.authenticate(
    //     testUser.username,
    //     'invalidPassword'
    //   );
    //   console.log(result)
    // })
    // it('throws error when using valid username but invalid password', (done) => {
    //     expect( () => {
    //       store.authenticate(testUser.username, 'invalidPassword')
    //       .then(done)
    //       .catch((err) => {
    //         err ? done.fail(err) : done()
    //       })
    //     })
    //   })
});
