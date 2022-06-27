/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { Parser, Part, Response } = require('parser-multipart/dist/umd/parser-multipart.js');
const response = require('../lib/response.cjs');

const json = response('json');

describe('exports parser-multipart/dist/umd/parser-multipart.js', function () {
  it('MultiData', function () {
    const parser = new Parser(json.headers['content-type']);
    parser.parse(json.body);
    const result = parser.parts.map((part) => part.response.json());
    assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
  });

  it('Part', function () {
    const part = new Part();
    part.parse(json.parts[0]);
    assert.deepEqual(part.response.json(), { name: 'item1' });
  });

  it('Response', function () {
    const response = new Response('application/http');
    response.parse(json.responses[0]);
    assert.deepEqual(response.json(), { name: 'item1' });
  });
});
