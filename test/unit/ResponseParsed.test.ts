import assert from 'assert';
import { Parser } from 'parser-multipart';
import Pinkie from 'pinkie-promise';
import response from '../lib/response.ts';

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);
const dataText = response(['text1', 'text2']);
const dataError = response([new Error('failed1'), new Error('failed2')]);

const rejects = (x: Promise<unknown>): Promise<unknown> => x.then(() => assert.ok(false)).catch((err: unknown) => assert.ok(!!err));

function responseAs(r: object) {
  return r as unknown as {
    type: string;
    headers: { get: (name: string) => string | null };
    body: unknown;
    ok: boolean;
    status: number;
    statusText: string;
    redirected: boolean;
    url: string;
    bodyUsed: boolean;
    clone: () => { json: () => Promise<unknown>; text: () => Promise<string> };
    text: () => Promise<string>;
    json: () => Promise<unknown>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    blob: () => Promise<Blob>;
    formData: () => Promise<FormData>;
    bytes: () => Promise<Uint8Array>;
  };
}

function responsesJson(responses: object[]): Promise<unknown[]> {
  return Promise.all(responses.map((res) => (res as unknown as { json: () => Promise<unknown> }).json()));
}

function responsesText(responses: object[]): Promise<string[]> {
  return Promise.all(responses.map((res) => (res as unknown as { text: () => Promise<string> }).text()));
}

describe('Response', () => {
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

  it('json', async () => {
    const parser = new Parser(`multipart/mixed; boundary=${dataJSON.boundary}`);
    parser.parse(dataJSON.body);

    const res = responseAs(parser.responses[0]);
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
    await rejects(res.arrayBuffer());
    await rejects(res.blob());
    await rejects(res.formData());
    await rejects(res.bytes());

    const jsons = await responsesJson(parser.responses);
    assert.deepEqual(jsons, [{ name: 'item1' }, { name: 'item2' }]);
  });

  it('text', async () => {
    const parser = new Parser(`multipart/mixed; boundary=${dataText.boundary}`);
    parser.parse(dataText.body);

    const res = responseAs(parser.responses[0]);
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
    await rejects(res.arrayBuffer());
    await rejects(res.blob());
    await rejects(res.formData());
    await rejects(res.bytes());

    const texts = await responsesText(parser.responses);
    assert.deepEqual(texts, ['text1', 'text2']);
  });

  it('error', async () => {
    const parser = new Parser(`multipart/mixed; boundary=${dataError.boundary}`);
    parser.parse(dataError.body);
    const texts = await responsesJson(parser.responses);

    const res = responseAs(parser.responses[0]);
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
    await rejects(res.arrayBuffer());
    await rejects(res.blob());
    await rejects(res.formData());
    await rejects(res.bytes());

    assert.deepEqual(texts, [{ error: { message: 'failed1' } }, { error: { message: 'failed2' } }]);
  });
});
