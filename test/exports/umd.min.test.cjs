const assert = require('assert');
const { Parser, Part, Response } = require('parser-multipart/dist/umd/parser-multipart.min.cjs');

describe('exports parser-multipart/dist/umd/parser-multipart.cjs', () => {
  it('named exports', () => {
    assert.equal(typeof Parser, 'function');
    assert.equal(typeof Part, 'function');
    assert.equal(typeof Response, 'function');
  });
});
