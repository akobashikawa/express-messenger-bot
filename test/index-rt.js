const { describe, Try } = require('riteway');

describe('trivial', async assert => {
    assert({
        given: 'hello',
        should: 'hello',
        actual: 'hello',
        expected: 'hello'
    });
});