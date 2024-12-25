import assert from 'assert';
import newlineIterator from 'newline-iterator';
// @ts-ignore
import { Response } from 'parser-multipart';
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import Promise from 'pinkie-promise';
// @ts-ignore
import response from '../lib/response.ts';

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);
const dataText = response(['text1', 'text2']);
const dataError = response([new Error('failed1'), new Error('failed2')]);

describe('Response', () => {
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
    assert.throws(() => new Response(undefined));
  });

  it('error: premature end', () => {
    const response = new Response('application/http');
    assert.throws(() => response.push(null));
  });

  it('error: parse completed', async () => {
    const response = new Response('application/http');
    response.parse(dataJSON.responses[0]);
    assert.deepEqual(await response.response.json(), { name: 'item1' });
    assert.throws(() => response.push(null));
  });

  it('error: use incomplete json', () => {
    const response = new Response('application/http');
    const iterator = newlineIterator(dataJSON.responses[0]);
    response.push(iterator.next().value);
    response.push(iterator.next().value);
    assert.throws(() => response.response.json());
  });

  it('json', async () => {
    const response = new Response('application/http');
    response.parse(dataJSON.responses[0]);
    assert.deepEqual(await response.response.json(), { name: 'item1' });
  });

  it('json as text', async () => {
    const response = new Response('application/http');
    response.parse(dataJSON.responses[0]);
    assert.equal(await response.response.text(), '{\r\n  "name": "item1"\r\n}');
  });

  it('error: use incomplete text', () => {
    const response = new Response('application/http');
    const iterator = newlineIterator(dataText.responses[0]);
    response.push(iterator.next().value);
    response.push(iterator.next().value);
    assert.throws(() => response.response.text());
  });

  it('text', async () => {
    const response = new Response('application/http');
    response.parse(dataText.responses[0]);
    assert.equal(await response.response.text(), 'text1');
  });

  it('text as json', () => {
    const response = new Response('application/http');
    response.parse(dataText.responses[0]);
    assert.throws(() => response.response.json());
  });

  it('error', async () => {
    const response = new Response('application/http');
    response.parse(dataError.responses[0]);
    assert.deepEqual(JSON.parse(await response.response.text()), {
      error: { message: 'failed1' },
    });
  });

  it('error as json', async () => {
    const response = new Response('application/http');
    response.parse(dataError.responses[0]);
    assert.deepEqual(await response.response.json(), {
      error: { message: 'failed1' },
    });
  });
});
