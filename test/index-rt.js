require('dotenv').config();

const { describe, Try } = require('riteway');
const request = require('supertest');
// const app = require('../app');
const app = 'http://localhost:3000';

// describe('trivial', async assert => {
//     assert({
//         given: 'hello',
//         should: 'hello',
//         actual: 'hello',
//         expected: 'hello'
//     });
// });

describe('GET /hello', async assert => {
    const url = `/hello`;
    request(app)
        .get(url)
        .expect(200)
        .then(res => assert({
            given: 'hello',
            should: 'return text hello',
            actual: res.text,
            expected: 'hello'
        }))
        .catch(err => {
            throw err;
        });
});

describe('GET /webhook', async assert => {
    let url;
    url = `/webhook`;
    request(app)
        .get(url)
        .expect(400)
        .then(res => assert({
            given: 'no query',
            should: 'return status 400',
            actual: res.status,
            expected: 400
        }))
        .catch(err => {
            throw err;
        });

    url = `/webhook?hub.verify_token=INVALID&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe`;
    request(app)
        .get(url)
        .expect(403)
        .then(res => assert({
            given: 'invalid VERIFY_TOKEN',
            should: 'return status 403',
            actual: res.status,
            expected: 403
        }))
        .catch(err => {
            throw err;
        });

    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    url = `/webhook?hub.verify_token=${VERIFY_TOKEN}&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe`;
    request(app)
        .get(url)
        .expect(200)
        .then(res => assert({
            given: 'valid VERIFY_TOKEN',
            should: 'return text CHALLENGE_ACCEPTED',
            actual: res.text,
            expected: 'CHALLENGE_ACCEPTED'
        }))
        .catch(err => {
            throw err;
        });
});

describe('POST /webhook', async assert => {
    let url;
    url = `/webhook`;
    request(app)
        .post(url)
        .set('Content-Type', 'application/json')
        .expect(400)
        .then(res => assert({
            given: 'no params',
            should: 'return status 400',
            actual: res.status,
            expected: 400
        }))
        .catch(err => {
            throw err;
        });

    request(app)
        .post(url)
        .set('Content-Type', 'application/json')
        .send('{"object": "any", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}')
        .expect(404)
        .then(res => assert({
            given: 'no param page',
            should: 'return status 404',
            actual: res.status,
            expected: 404
        }))
        .catch(err => {
            throw err;
        });

    request(app)
        .post(url)
        .set('Content-Type', 'application/json')
        .send('{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}')
        .expect(200)
        .then(res => assert({
            given: 'params',
            should: 'return text EVENT_RECEIVED',
            actual: res.text,
            expected: 'EVENT_RECEIVED'
        }))
        .catch(err => {
            throw err;
        });
});