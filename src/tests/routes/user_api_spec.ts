import app from '../../server'
import { agent as request } from 'supertest'
import client from '../../database'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User, UserStore } from '../../models/user'

const admin: User = {
    user_id: 0,
    username: 'admin',
    firstname: 'Ed',
    lastname: 'Mint',
    password_digest: 'difficult',
    user_type: 'admin'
}


const testUser = {
    user_id: 0,
    username: 'bob',
    firstname: 'bob',
    lastname: 'bobek',
    password: '1234',
    user_type: 'regular'
}

// get tokenSecret from enviromental variables
dotenv.config()
const tokenSecret: string = process.env.TOKEN_SECRET as string

let adminToken = ''
let testUserToken = ''

describe('User API testing', () => {

    beforeAll( async () => {
        // setup users table for testing
        try {
            // clear user table
            // (do manually as user model has no delete all users method)
            const conn = await client.connect()
            const sqlDelete = 'TRUNCATE users CASCADE'
            await conn.query(sqlDelete)
            conn.release()

            // use user model to add admin user to table
            const store = new UserStore()
            await store.create(admin)

            // get token for admin user
            adminToken = await store.authenticate(admin.username, admin.password_digest) as string

        } catch(err) {
            console.log(`Error seting up user table. Error: ${err}`)
        }
    })
    

    // it('"Application Starting Page" displayed at project root', (done) => {
    //     request(app)
    //     .get('/')
    //     .expect(200)
    //     .expect('Content-Type', 'text/html; charset=utf-8')
    //     .then((response) => {
    //         // console.log(response)
    //         expect(response.text).toBe('Application Starting Page')
    //         done()
    //     })
    //     .catch((Error) => {
    //         Error ? fail() : done();
    //         console.log('error')
    //     })
    // })
    it('POST /users returns Json Web Token', (done) => {
        request(app)
        .post('/users')
        .send(testUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            // save token to use in testing other endpoints
            testUserToken = response.body
            // console.log(`TOKEN RECEIVED:\n ${token}`)

            // get id of testUser created from token
        const testUserObject: jsonwebtoken.JwtPayload = jsonwebtoken.verify(testUserToken, tokenSecret) as jsonwebtoken.JwtPayload
            const testUserId = testUserObject.user_id
            // update testUser object with correct id
            testUser.user_id = testUserId
            // console.log(`TEST USER UPDATED ${JSON.stringify(testUser, null, 4)}`)
            done()
        })
        .catch((Error) => {
            Error ? fail() : done();
            console.log(Error)
        })
    })
    it('GET /users/id lets user see its own details', (done) => {
        request(app)
        .get(`/users/${testUser.user_id}`)
        // .get(`/users/3`)
        // send token to endpoint
        .set('Authorization', 'Bearer' + testUserToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
            // console.log(`RESPONSE:`)
            // console.log(response.body)
            expect(response.body.user_id = testUser.user_id)
            done()
        })
        .catch((err) => {
            console.log(`Error: ${err}`)
            done.fail()
        })
    })
    it('GET /users/id refuses to show users info of other users', (done) => {
        request(app)
        .get(`/users/0`)
        // send token to endpoint
        .set('Authorization', 'Bearer' + testUserToken)
        .expect(401)
        .end((err) => {
            err ? done.fail(err) : done()
        })
    })
    it('GET/users/id lets admin see any user\'s details', (done) => {
        // console.log(`ADMIN TOKEN: \n ${adminToken}`)
        request(app)
        .get(`/users/${testUser.user_id}`)
        // send admin token
        .set('Authorization', 'Bearer' + adminToken)
        .expect(200)
        .then((response) => {
            expect(response.body.username).toEqual(testUser.username)
            done()
        })
        .catch((err) => {
            done.fail(err)
        })
    })
    it('GET /users returns list of users to admin user', (done) => {
        request(app)
        .get('/users')
        // send admin token
        .set('Authorization', 'Bearer' + adminToken)
        .expect(200)
        .then((response) => {
            // console.log(response.body)
            expect(response.body.length).toEqual(2)
            expect(response.body[1].username).toEqual(testUser.username)
            done()
        })
        .catch((err) => {
            console.log(err)
            done.fail()
        })
    })
    it('GET /users returns 401 status code if requested by regular user', (done) => {
        request(app)
        .get('/users')
        .set('Authorization', 'Bearer' + testUserToken)
        .expect(401)
        .end((err) => {
            err ? done.fail(err) : done()
        })
    })
})