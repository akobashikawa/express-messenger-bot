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