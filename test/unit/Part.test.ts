import assert from 'assert';
// @ts-ignore
import { Part } from 'parser-multipart';
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import Promise from 'pinkie-promise';
// @ts-ignore
import response from '../lib/response.ts';

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);

describe('Part', () => {
  const root = typeof global !== 'undefined' ? global : window;
  let rootPromise: Promise;
  before(() => {
    rootPromise = root.Promise;
    root.Promise = Promise;
  });
  after(() => {
    root.Promise = rootPromise;
  });

  it('error: missing content type', () => {
    const part = new Part();
    const parts = dataJSON.parts[0].split('\n');
    assert.throws(() => part.parse(parts.splice(1).join('\n')));
  });

  it('error: premature end', () => {
    const part = new Part();
    assert.throws(() => part.push(null));
  });

  it('error: parse completed', async () => {
    const part = new Part();
    part.parse(dataJSON.parts[0]);
    assert.deepEqual(await part.response.json(), { name: 'item1' });
    assert.throws(() => part.push(null));
  });

  it('error: unexpected content-type', () => {
    const part = new Part();
    assert.throws(() => part.parse('Content-Type: unexpected\n\nHTTP/1.1 200 OK\nContent-Type: application/text; charset=UTF-8\n\ntext\n'));
  });

  it('json', async () => {
    const part = new Part();
    part.parse(dataJSON.parts[0]);
    assert.deepEqual(await part.response.json(), { name: 'item1' });
  });
});
