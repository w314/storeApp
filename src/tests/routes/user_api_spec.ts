import app from '../../server'
import supertest, { agent as request } from 'supertest'
import { doesNotMatch } from 'assert'

const testUser1 = {
    id: 1,
    username: 'bob',
    firstname: 'bob',
    lastname: 'bobek',
    password: '1234'
}

describe('API TEST TESTING GET/ endpoint', () => {
    it('returns JWT token when creating new user'), () => {
        request(app)
            .get('/')
            .expect(200)
            // .expect('Content-Type', 'text/html; charset=utf-8')
            .then((response) => {
                console.log(response)
                expect(response.text).toBe('Application starting page')
                // done()
            })
            .catch((Error) => {
                // Error ? done.fail(Error) : done();
            })
    }
})

// describe('POST/users endpoint', () => {
//     it('returns JWT token when creating new user'), (done: Function) => {
//         request(app)
//             .post('/users')
//             .send(testUser1)
//             .set('Accept', 'application/json')
//             .expect('Conent-Type', /json/)
//             .expect(200)
//             .end(function (err, res) {
//                 if (err) return done(err)
//                 return done()
//             })
//     }
// })