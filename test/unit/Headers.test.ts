import assert from 'assert';
import { Parser } from 'parser-multipart';
import response from '../lib/response.cjs';

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);

describe('headers', function () {
  it('headers missing', function () {
    assert.throws(() => new Parser(undefined));
  });

  it('headers malformed', function () {
    assert.throws(() => new Parser(`multipart/mixed boundary=${dataJSON.boundary}`));
  });

  it('headers missing multipart/mixed', function () {
    assert.throws(() => new Parser(`unexpected; boundary=${dataJSON.boundary}`));
  });

  it('headers missing boundary', function () {
    assert.throws(() => new Parser(`multipart/mixed; notboundary=${dataJSON.boundary}`));
  });

  it('headers missing content-type', function () {
    const headers = {
      'not-content-type': `multipart/mixed; boundary=${dataJSON.boundary}`,
    };
    assert.throws(() => new Parser(headers));
  });

  it('headers string', async function () {
    const parser = new Parser(`multipart/mixed; boundary=${dataJSON.boundary}`);
    parser.parse(dataJSON.body);
    const result = await Promise.all(parser.responses.map((res) => res.json()));
    assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
  });

  it('headers HeadersObject', async function () {
    const headers = {
      'content-type': `multipart/mixed; boundary=${dataJSON.boundary}`,
    };
    const parser = new Parser(headers);
    parser.parse(dataJSON.body);
    const result = await Promise.all(parser.responses.map((res) => res.json()));
    assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
  });

  typeof Headers === 'undefined' ||
    it('headers Headers', async function () {
      const headers: Headers = new Headers();
      headers.set('content-type', `multipart/mixed; boundary=${dataJSON.boundary}`);
      const parser = new Parser(headers);
      parser.parse(dataJSON.body);
      const result = await Promise.all(parser.responses.map((res) => res.json()));
      assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
    });

  it('error: parse completed', async function () {
    const parser = new Parser(dataJSON.headers['content-type']);
    parser.parse(dataJSON.body);
    const result = await Promise.all(parser.responses.map((res) => res.json()));
    assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
    assert.throws(() => parser.push(null));
  });

  it('empty line', function () {
    const parser = new Parser(dataJSON.headers['content-type']);
    assert.doesNotThrow(() => parser.push('')); // can push empty line
  });

  it('error: use incomplete json', function () {
    const parser = new Parser(dataJSON.headers['content-type']);
    assert.throws(() => parser.push('not-a-boundary'));
  });

  it('error: malformed header', function () {
    const parser = new Parser(dataJSON.headers['content-type']);
    parser.push(`--${dataJSON.boundary}`);
    parser.push('Content-Type: application/http');
    parser.push('');
    parser.push('HTTP/1.1 200 OK');
    parser.push('Content-Type: application/text; charset=UTF-8');
    assert.throws(() => parser.push('Not-A-Header'));
  });
});
