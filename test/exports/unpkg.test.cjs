/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { Parser, Part, Response } = require('parser-multipart/dist/umd/parser-multipart.js');
const response = require('../lib/response.cjs');

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);

describe('exports parser-multipart/dist/umd/parser-multipart.js', function () {
  it('MultiData', async function () {
    const parser = new Parser(dataJSON.headers['content-type']);
    parser.parse(dataJSON.body);
    const result = await Promise.all(parser.responses.map((res) => res.json()));
    assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
  });

  it('Part', async function () {
    const part = new Part();
    part.parse(dataJSON.parts[0]);
    assert.deepEqual(await part.response.json(), { name: 'item1' });
  });

  it('Response', async function () {
    const response = new Response('application/http');
    response.parse(dataJSON.responses[0]);
    assert.deepEqual(await response.response.json(), { name: 'item1' });
  });
});
