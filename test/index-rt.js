require('dotenv').config();

const { describe, Try } = require('riteway');
const request = require('supertest');
const app = require('../app');

// describe('trivial', async assert => {
//     assert({
//         given: 'hello',
//         should: 'hello',
//         actual: 'hello',
//         expected: 'hello'
//     });
// });

describe('/hello', async assert => {
    const url = '/hello';
    request(app)
        .get(url)
        .expect(200)
        .end((err, res) => {
            if (err) throw err;

            return assert({
                given: 'hello',
                should: 'return text hello',
                actual: res.text,
                expected: 'hello'
            });
        });
});

describe('/webhook', async assert => {
    let url;
    url = `/webhook`;
    request(app)
        .get(url)
        .expect(400)
        .end((err, res) => {
            if (err) throw err;

            return assert({
                given: 'no query',
                should: 'return status 400',
                actual: res.status,
                expected: 400
            });
        });

    url = `/webhook?hub.verify_token=INVALID&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe`;
    request(app)
        .get(url)
        .expect(403)
        .end((err, res) => {
            if (err) throw err;

            return assert({
                given: 'invalid VERIFY_TOKEN',
                should: 'return status 403',
                actual: res.status,
                expected: 403
            });
        });

    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    url = `/webhook?hub.verify_token=${VERIFY_TOKEN}&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe`;
    request(app)
        .get(url)
        .expect(200)
        .end((err, res) => {
            if (err) throw err;

            return assert({
                given: 'valid VERIFY_TOKEN',
                should: 'return text CHALLENGE_ACCEPTED',
                actual: res.text,
                expected: 'CHALLENGE_ACCEPTED'
            });
        });
});