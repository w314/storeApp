import app from '../../server'
import { agent as request } from 'supertest'
import client from '../../database'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

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
        // clear user table
        console.log('RUNNING BEFOREALL')
        try {
            const conn = await client.connect()
            // console.log(client)
            const sql = 'DELETE FROM users'
            await conn.query(sql)
            conn.release()
        } catch(err) {
            console.log(`Error deleting content of user table. Error: ${err}`)
        }
    })
    

    it('"Application Starting Page" displayed at project root', (done) => {
        request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .then((response) => {
            // console.log(response)
            expect(response.text).toBe('Application Starting Page')
            done()
        })
        .catch((Error) => {
            Error ? fail() : done();
            console.log('error')
        })
    })
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
            console.log(`TOKEN RECEIVED:\n ${token}`)

            // get id of testUser created from token
            const testUserObject: jsonwebtoken.JwtPayload = jsonwebtoken.verify(token, tokenSecret) as jsonwebtoken.JwtPayload
            const testUserId = testUserObject.id
            // update testUser object with correct id
            testUser.id = testUserId
            console.log(`TEST USER UPDATED ${JSON.stringify(testUser, null, 4)}`)
            done()
        })
        .catch((Error) => {
            Error ? fail() : done();
            console.log(Error)
        })
    })
    it('GET /users/id returns correct user', (done) => {
        request(app)
        .get(`/users/${testUser.id}`)
        // .get(`/users/3`)
        // send token to endpoint
        .set('Authorization', 'Bearer' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
            console.log(`RESPONSE:`)
            console.log(response.body)
            expect(response.body).toBeTruthy
            done()
        })
        .catch((err) => {
            console.log(`Error: ${err}`)
            done.fail()
        })

    })
})