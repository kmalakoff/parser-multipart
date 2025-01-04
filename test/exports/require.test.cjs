const assert = require('assert');
const { Parser, Part, Response } = require('parser-multipart');

describe('exports .cjs', () => {
  it('named exports', () => {
    assert.equal(typeof Parser, 'function');
    assert.equal(typeof Part, 'function');
    assert.equal(typeof Response, 'function');
  });
});
