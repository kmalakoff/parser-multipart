import assert from 'assert';
// @ts-ignore
import { Part } from 'parser-multipart';
import Pinkie from 'pinkie-promise';
import response from '../lib/response.ts';

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);

describe('Part', () => {
  (() => {
    // patch and restore promise
    if (typeof global === 'undefined') return;
    const globalPromise = global.Promise;
    before(() => {
      global.Promise = Pinkie;
    });
    after(() => {
      global.Promise = globalPromise;
    });
  })();

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
