import app from '../../server'
import { agent as request } from 'supertest'
import client from '../../database'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User, UserStore } from '../../models/user'

const testUser = {
    id: 0,
    username: 'bob',
    firstname: 'bob',
    lastname: 'bobek',
    password: '1234'
}

// get tokenSecret from enviromental variables
dotenv.config()
const tokenSecret: string = process.env.TOKEN_SECRET as string

let token = ''

describe('User API testing', () => {

    beforeAll( async () => {
        // setup users table for testing
        try {
            // clear user table
            // (do manually as user model has no delete all users method)
            const conn = await client.connect()
            const sqlDelete = 'DELETE FROM users'
            await conn.query(sqlDelete)
            conn.release()

            // use user model to add one user to table
            const firstUser: User = {
                id: 0,
                username: 'firstuser',
                firstname: 'First',
                lastname: 'Last',
                password_digest: 'firstpass'
            }
            const store = new UserStore()
            await store.create(firstUser)
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
            token = response.body
            // console.log(`TOKEN RECEIVED:\n ${token}`)

            // get id of testUser created from token
            const testUserObject: jsonwebtoken.JwtPayload = jsonwebtoken.verify(token, tokenSecret) as jsonwebtoken.JwtPayload
            const testUserId = testUserObject.id
            // update testUser object with correct id
            testUser.id = testUserId
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
        .get(`/users/${testUser.id}`)
        // .get(`/users/3`)
        // send token to endpoint
        .set('Authorization', 'Bearer' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
            // console.log(`RESPONSE:`)
            // console.log(response.body)
            expect(response.body.id = testUser.id)
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
        .set('Authorization', 'Bearer' + token)
        .expect(401)
        .end((err) => {
            if (err) {
                console.log(`Error: ${err}`)
                done.fail()
            } else {
                done()
            }
        })
    })
    it('GET /users returns list of users', (done) => {
        request(app)
        .get('/users')
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
})