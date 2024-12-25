// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
const Promise = require('pinkie-promise');
const assert = require('assert');
const { Parser, Part, Response } = require('parser-multipart');
const response = require('../lib/response.cjs');

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);

describe('exports .cjs', () => {
  const root = typeof global !== 'undefined' ? global : window;
  let rootPromise;
  before(() => {
    rootPromise = root.Promise;
    root.Promise = Promise;
  });
  after(() => {
    root.Promise = rootPromise;
  });

  it('MultiData', async () => {
    const parser = new Parser(dataJSON.headers['content-type']);
    parser.parse(dataJSON.body);
    const result = await Promise.all(parser.responses.map((res) => res.json()));
    assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
  });

  it('Part', async () => {
    const part = new Part();
    part.parse(dataJSON.parts[0]);
    assert.deepEqual(await part.response.json(), { name: 'item1' });
  });

  it('Response', async () => {
    const response = new Response('application/http');
    response.parse(dataJSON.responses[0]);
    assert.deepEqual(await response.response.json(), { name: 'item1' });
  });
});
