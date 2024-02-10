import assert from 'assert';
import newlineIterator from 'newline-iterator';
import { Response } from 'parser-multipart';
import response from '../lib/response.cjs';

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);
const dataText = response(['text1', 'text2']);
const dataError = response([new Error('failed1'), new Error('failed2')]);

describe('Response', function () {
  it('error: missing content type', function () {
    assert.throws(() => new Response(undefined));
  });

  it('error: premature end', function () {
    const response = new Response('application/http');
    assert.throws(() => response.push(null));
  });

  it('error: parse completed', async function () {
    const response = new Response('application/http');
    response.parse(dataJSON.responses[0]);
    assert.deepEqual(await response.response.json(), { name: 'item1' });
    assert.throws(() => response.push(null));
  });

  it('error: use incomplete json', function () {
    const response = new Response('application/http');
    const iterator = newlineIterator(dataJSON.responses[0]);
    response.push(iterator.next().value);
    response.push(iterator.next().value);
    assert.throws(() => response.response.json());
  });

  it('json', async function () {
    const response = new Response('application/http');
    response.parse(dataJSON.responses[0]);
    assert.deepEqual(await response.response.json(), { name: 'item1' });
  });

  it('json as text', async function () {
    const response = new Response('application/http');
    response.parse(dataJSON.responses[0]);
    assert.equal(await response.response.text(), '{\r\n  "name": "item1"\r\n}');
  });

  it('error: use incomplete text', function () {
    const response = new Response('application/http');
    const iterator = newlineIterator(dataText.responses[0]);
    response.push(iterator.next().value);
    response.push(iterator.next().value);
    assert.throws(() => response.response.text());
  });

  it('text', async function () {
    const response = new Response('application/http');
    response.parse(dataText.responses[0]);
    assert.equal(await response.response.text(), 'text1');
  });

  it('text as json', function () {
    const response = new Response('application/http');
    response.parse(dataText.responses[0]);
    assert.throws(() => response.response.json());
  });

  it('error', async function () {
    const response = new Response('application/http');
    response.parse(dataError.responses[0]);
    assert.deepEqual(JSON.parse(await response.response.text()), { error: { message: 'failed1' } });
  });

  it('error as json', async function () {
    const response = new Response('application/http');
    response.parse(dataError.responses[0]);
    assert.deepEqual(await response.response.json(), { error: { message: 'failed1' } });
  });
});
