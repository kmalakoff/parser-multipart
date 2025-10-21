import assert from 'assert';
import MultiData from 'multi-data';
import { Parser } from 'parser-multipart';
import Pinkie from 'pinkie-promise';
import response from '../lib/response.ts';

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);

describe('Parser', () => {
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

  it('text', async () => {
    const boundary = 'batch_xvED97sOkyA_AAGGLqi8oGg';
    const data = new MultiData(boundary);
    data.append('entry1', JSON.stringify({ name: 'item1' }), {
      headers: { 'Content-Type': 'application/json' },
    });
    data.append('entry2', JSON.stringify({ name: 'item2' }), {
      headers: { 'Content-Type': 'application/json' },
    });

    // parse multi-data body
    const parser = new Parser(`multipart/mixed; boundary=${boundary}`);
    parser.parse(data.toString());
    assert.deepEqual(await Promise.all(parser.responses.map((res) => res.json())), [{ name: 'item1' }, { name: 'item2' }]);
  });

  it('json', async () => {
    const parser = new Parser(dataJSON.headers);
    assert.deepEqual(await Promise.all(parser.parse(dataJSON.body).responses.map((res) => res.json())), [{ name: 'item1' }, { name: 'item2' }]);
  });
});
