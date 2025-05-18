const assert = require('assert');

let umd = null;
try {
  umd = require('parser-multipart/umd');
} catch (_) {
  umd = require('parser-multipart/dist/umd/parser-multipart.cjs');
}
const parserMultipart = typeof window !== 'undefined' ? window.parserMultipart : umd.default || umd;
const { Parser, Part, Response } = parserMultipart;

describe('exports umd', () => {
  it('named exports', () => {
    assert.equal(typeof Parser, 'function');
    assert.equal(typeof Part, 'function');
    assert.equal(typeof Response, 'function');
  });
});
