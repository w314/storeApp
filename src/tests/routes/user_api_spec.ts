// import app from '../../server'
// import { agent as request } from 'supertest'
// import client from '../../database'
// import jsonwebtoken from 'jsonwebtoken'
// import dotenv from 'dotenv'
// import { User, UserStore } from '../../models/user'
// import { DbSetup } from '../utilities/dbSetup'

// xdescribe('User API testing', () => {

//     // get tokenSecret from enviromental variables
//     dotenv.config()
//     const tokenSecret: string = process.env.TOKEN_SECRET as string

//     let adminToken = ''
//     let userToken = ''

//     const dbSetup = new DbSetup()

//     beforeAll( async () => {
//         // setup database for testing
//         await dbSetup.setup()
//         // get token for an admin and a regular user
//         const userStore = new UserStore()
//         adminToken = await userStore.authenticate(dbSetup.admin.username, dbSetup.admin.password_digest) as string
//         userToken = await userStore.authenticate(dbSetup.user.username, dbSetup.user.password_digest) as string
//     })

//     // it('"Application Starting Page" displayed at project root', (done) => {
//     //     request(app)
//     //     .get('/')
//     //     .expect(200)
//     //     .expect('Content-Type', 'text/html; charset=utf-8')
//     //     .then((response) => {
//     //         // console.log(response)
//     //         expect(response.text).toBe('Application Starting Page')
//     //         done()
//     //     })
//     //     .catch((Error) => {
//     //         Error ? fail() : done();
//     //         console.log('error')
//     //     })
//     // })

//     it('POST /users returns Json Web Token', (done) => {

//         // add new user
//         const newUser = {
//             user_id: dbSetup.users.length + 1,
//             username: 'newUser',
//             firstname: 'New',
//             lastname: 'User',
//             password: '1234',
//             user_type: 'regular'
//         }

//         request(app)
//         .post('/users')
//         .send(newUser)
//         .set('Accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .then((response) => {
//             // save token to use in testing other endpoints
//             const newUserToken = response.body
//             // console.log(`TOKEN RECEIVED:\n ${token}`)

//             // get user details from token
//             const userObject: jsonwebtoken.JwtPayload = jsonwebtoken.verify(newUserToken, tokenSecret) as jsonwebtoken.JwtPayload

//             // check username in token
//             expect(userObject.username).toEqual(newUser.username)
//             // const testUserId = userObject.user_id
//             // // update testUser object with correct id
//             // user.user_id = testUserId
//             // console.log(`TEST USER UPDATED ${JSON.stringify(testUser, null, 4)}`)
//             done()
//         })
//         .catch((Error) => {
//             Error ? fail() : done();
//             console.log(Error)
//         })
//     })

//     it('GET /users/id lets user see its own details', (done) => {
//         request(app)
//         .get(`/users/${dbSetup.user.user_id}`)
//         // send token to endpoint
//         .set('Authorization', 'Bearer' + userToken)
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .then((response) => {
//             // console.log(`RESPONSE:`)
//             // console.log(response.body)
//             expect(response.body.user_id = dbSetup.user.user_id)
//             done()
//         })
//         .catch((err) => {
//             console.log(`Error: ${err}`)
//             done.fail()
//         })
//     })

//     it('GET /users/id refuses to show users info of other users', (done) => {
//         request(app)
//         // ask for details of newly created user
//         .get(`/users/${dbSetup.users.length + 1}`)
//         // send token to endpoint use token of dbSetup's regular user
//         .set('Authorization', 'Bearer' + userToken)
//         .expect(401)
//         .end((err) => {
//             err ? done.fail(err) : done()
//         })
//     })

//     it('GET/users/id lets admin see any user\'s details', (done) => {
//         // console.log(`ADMIN TOKEN: \n ${adminToken}`)
//         request(app)
//         // ask for details of dbSetup's regular user
//         .get(`/users/${dbSetup.user.user_id}`)
//         // send admin token
//         .set('Authorization', 'Bearer' + adminToken)
//         .expect(200)
//         .then((response) => {
//             expect(response.body.username).toEqual(dbSetup.user.username)
//             done()
//         })
//         .catch((err) => {
//             done.fail(err)
//         })
//     })

//     it('GET /users returns list of users to admin user', (done) => {
//         request(app)
//         .get('/users')
//         // send admin token
//         .set('Authorization', 'Bearer' + adminToken)
//         .expect(200)
//         .then((response) => {
//             // console.log(response.body)
//             expect(response.body.length).toEqual(dbSetup.users.length + 1)
//             done()
//         })
//         .catch((err) => {
//             console.log(err)
//             done.fail()
//         })
//     })
//     it('GET /users returns 401 status code if requested by regular user', (done) => {
//         request(app)
//         .get('/users')
//         .set('Authorization', 'Bearer' + userToken)
//         .expect(401)
//         .end((err) => {
//             err ? done.fail(err) : done()
//         })
//     })
// })
