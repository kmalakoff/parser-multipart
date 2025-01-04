import assert from 'assert';
import { Parser, Part, Response } from 'parser-multipart';

describe('exports .mjs', () => {
  it('named exports', () => {
    assert.equal(typeof Parser, 'function');
    assert.equal(typeof Part, 'function');
    assert.equal(typeof Response, 'function');
  });
});
