import assert from 'assert';
// @ts-ignore
import { Parser } from 'parser-multipart';
import response from '../lib/response.cjs';

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);
const dataText = response(['text1', 'text2']);
const dataError = response([new Error('failed1'), new Error('failed2')]);

describe('Response', () => {
  it('json', async () => {
    const parser = new Parser(`multipart/mixed; boundary=${dataJSON.boundary}`);
    parser.parse(dataJSON.body);

    const res = parser.responses[0];
    assert.equal(res.type, 'default');
    assert.equal(res.headers.get('content-type'), 'application/json; charset=UTF-8');
    assert.throws(() => res.body);
    assert.equal(res.ok, true);
    assert.equal(res.status, 200);
    assert.equal(res.statusText, 'OK');
    assert.equal(res.redirected, false);
    assert.equal(res.url, '');
    assert.deepEqual(await res.clone().json(), { name: 'item1' });
    assert.equal(res.bodyUsed, false);
    assert.equal(typeof res.text, 'function');
    assert.equal(typeof res.json, 'function');
    assert.throws(() => res.arrayBuffer());
    assert.throws(() => res.blob());
    assert.throws(() => res.formData());

    const jsons = await Promise.all(parser.responses.map((res) => res.json()));
    assert.deepEqual(jsons, [{ name: 'item1' }, { name: 'item2' }]);
  });

  it('text', async () => {
    const parser = new Parser(`multipart/mixed; boundary=${dataText.boundary}`);
    parser.parse(dataText.body);

    const res = parser.responses[0];
    assert.equal(res.type, 'default');
    assert.equal(res.headers.get('content-type'), 'application/text; charset=UTF-8');
    assert.throws(() => res.body);
    assert.equal(res.ok, true);
    assert.equal(res.status, 200);
    assert.equal(res.statusText, 'OK');
    assert.equal(res.redirected, false);
    assert.equal(res.url, '');
    assert.equal(await res.clone().text(), 'text1');
    assert.equal(res.bodyUsed, false);
    assert.equal(typeof res.text, 'function');
    assert.equal(typeof res.json, 'function');
    assert.throws(() => res.arrayBuffer());
    assert.throws(() => res.blob());
    assert.throws(() => res.formData());

    const texts = await Promise.all(parser.responses.map((res) => res.text()));
    assert.deepEqual(texts, ['text1', 'text2']);
  });

  it('error', async () => {
    const parser = new Parser(`multipart/mixed; boundary=${dataError.boundary}`);
    parser.parse(dataError.body);
    const texts = await Promise.all(parser.responses.map((res) => res.json()));

    const res = parser.responses[0];
    assert.equal(res.type, 'default');
    assert.equal(res.headers.get('content-type'), 'application/json; charset=UTF-8');
    assert.throws(() => res.body);
    assert.equal(res.ok, false);
    assert.equal(res.status, 401);
    assert.equal(res.statusText, 'Unauthorized');
    assert.equal(res.redirected, false);
    assert.equal(res.url, '');
    assert.deepEqual(await res.clone().json(), {
      error: { message: 'failed1' },
    });
    assert.equal(res.bodyUsed, false);
    assert.equal(typeof res.text, 'function');
    assert.equal(typeof res.json, 'function');
    assert.throws(() => res.arrayBuffer());
    assert.throws(() => res.blob());
    assert.throws(() => res.formData());

    assert.deepEqual(texts, [{ error: { message: 'failed1' } }, { error: { message: 'failed2' } }]);
  });
});
