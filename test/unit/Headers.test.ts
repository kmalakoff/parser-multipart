import assert from 'assert';
import { Parser } from 'parser-multipart';
import Pinkie from 'pinkie-promise';
import response from '../lib/response.ts';

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);

describe('headers', () => {
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

  it('headers missing', () => {
    assert.throws(() => new Parser(undefined));
  });

  it('headers malformed', () => {
    assert.throws(() => new Parser(`multipart/mixed boundary=${dataJSON.boundary}`));
  });

  it('headers missing multipart/mixed', () => {
    assert.throws(() => new Parser(`unexpected; boundary=${dataJSON.boundary}`));
  });

  it('headers missing boundary', () => {
    assert.throws(() => new Parser(`multipart/mixed; notboundary=${dataJSON.boundary}`));
  });

  it('headers missing content-type', () => {
    const headers = {
      'not-content-type': `multipart/mixed; boundary=${dataJSON.boundary}`,
    };
    assert.throws(() => new Parser(headers));
  });

  it('headers string', async () => {
    const parser = new Parser(`multipart/mixed; boundary=${dataJSON.boundary}`);
    parser.parse(dataJSON.body);
    const result = await Promise.all(parser.responses.map((res) => res.json()));
    assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
  });

  it('headers HeadersObject', async () => {
    const headers = {
      'content-type': `multipart/mixed; boundary=${dataJSON.boundary}`,
    };
    const parser = new Parser(headers);
    parser.parse(dataJSON.body);
    const result = await Promise.all(parser.responses.map((res) => res.json()));
    assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
  });

  typeof Headers === 'undefined' ||
    it('headers Headers', async () => {
      const headers: Headers = new Headers();
      headers.set('content-type', `multipart/mixed; boundary=${dataJSON.boundary}`);
      const parser = new Parser(headers);
      parser.parse(dataJSON.body);
      const result = await Promise.all(parser.responses.map((res) => res.json()));
      assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
    });

  it('error: parse completed', async () => {
    const parser = new Parser(dataJSON.headers['content-type']);
    parser.parse(dataJSON.body);
    const result = await Promise.all(parser.responses.map((res) => res.json()));
    assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
    assert.throws(() => parser.push(null));
  });

  it('empty line', () => {
    const parser = new Parser(dataJSON.headers['content-type']);
    assert.doesNotThrow(() => parser.push('')); // can push empty line
  });

  it('error: use incomplete json', () => {
    const parser = new Parser(dataJSON.headers['content-type']);
    assert.throws(() => parser.push('not-a-boundary'));
  });

  it('error: malformed header', () => {
    const parser = new Parser(dataJSON.headers['content-type']);
    parser.push(`--${dataJSON.boundary}`);
    parser.push('Content-Type: application/http');
    parser.push('');
    parser.push('HTTP/1.1 200 OK');
    parser.push('Content-Type: application/text; charset=UTF-8');
    assert.throws(() => parser.push('Not-A-Header'));
  });
});
