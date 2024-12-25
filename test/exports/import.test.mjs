import assert from 'assert';
import { Parser, Part, Response } from 'parser-multipart';
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import Promise from 'pinkie-promise';
// @ts-ignore
import response from '../lib/response.ts';

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);

describe('exports .mjs', () => {
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
