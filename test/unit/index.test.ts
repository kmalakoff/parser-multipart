import assert from 'assert';
import newlineIterator from 'newline-iterator';
import MultiData from 'multi-data';
import { Parser, Part, Response, HeadersObject } from 'parser-multipart';
import response from '../lib/response.cjs';

const json = response('json');
const text = response('text');

describe('exports .ts', function () {
  describe('headers', function () {
    it('headers missing', function () {
      assert.throws(() => new Parser(undefined));
    });

    it('headers malformed', function () {
      assert.throws(() => new Parser(`multipart/mixed boundary=${json.boundary}`));
    });

    it('headers missing multipart/mixed', function () {
      assert.throws(() => new Parser(`unexpected; boundary=${json.boundary}`));
    });

    it('headers missing boundary', function () {
      assert.throws(() => new Parser(`multipart/mixed; notboundary=${json.boundary}`));
    });

    it('headers missing content-type', function () {
      const headers: HeadersObject = {
        'not-content-type': `multipart/mixed; boundary=${json.boundary}`,
      };
      assert.throws(() => new Parser(headers));
    });

    it('headers string', function () {
      const parser = new Parser(`multipart/mixed; boundary=${json.boundary}`);
      parser.parse(json.body);
      const result = parser.parts.map((part) => part.response.json());
      assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
    });

    it('headers HeadersObject', function () {
      const headers: HeadersObject = {
        'content-type': `multipart/mixed; boundary=${json.boundary}`,
      };
      const parser = new Parser(headers);
      parser.parse(json.body);
      const result = parser.parts.map((part) => part.response.json());
      assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
    });

    typeof Headers === 'undefined' ||
      it('headers Headers', function () {
        const headers: Headers = new Headers();
        headers.set('content-type', `multipart/mixed; boundary=${json.boundary}`);
        const parser = new Parser(headers);
        parser.parse(json.body);
        const result = parser.parts.map((part) => part.response.json());
        assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
      });

    it('error: parse completed', function () {
      const parser = new Parser(json.headers['content-type']);
      parser.parse(json.body);
      const result = parser.parts.map((part) => part.response.json());
      assert.deepEqual(result, [{ name: 'item1' }, { name: 'item2' }]);
      assert.throws(() => parser.push(null));
    });

    it('empty line', function () {
      const parser = new Parser(json.headers['content-type']);
      assert.doesNotThrow(() => parser.push('')); // can push empty line
    });

    it('error: use incomplete json', function () {
      const parser = new Parser(json.headers['content-type']);
      assert.throws(() => parser.push('not-a-boundary'));
    });

    it('error: malformed header', function () {
      const parser = new Parser(json.headers['content-type']);
      parser.push(`--${json.boundary}`);
      parser.push('Content-Type: application/http');
      parser.push('');
      parser.push('HTTP/1.1 200 OK');
      parser.push('Content-Type: application/text; charset=UTF-8');
      assert.throws(() => parser.push('Not-A-Header'));
    });
  });

  describe('Part', function () {
    it('error: missing content type', function () {
      const part = new Part();
      const parts = json.parts[0].split('\n');
      assert.throws(() => part.parse(parts.splice(1).join('\n')));
    });

    it('error: premature end', function () {
      const part = new Part();
      assert.throws(() => part.push(null));
    });

    it('error: parse completed', function () {
      const part = new Part();
      part.parse(json.parts[0]);
      assert.deepEqual(part.response.json(), { name: 'item1' });
      assert.throws(() => part.push(null));
    });

    it('error: unexpected content-type', function () {
      const part = new Part();
      assert.throws(() => part.parse('Content-Type: unexpected\n\nHTTP/1.1 200 OK\nContent-Type: application/text; charset=UTF-8\n\ntext\n'));
    });

    it('json', function () {
      const part = new Part();
      part.parse(json.parts[0]);
      assert.deepEqual(part.response.json(), { name: 'item1' });
    });
  });

  describe('Response', function () {
    it('error: missing content type', function () {
      assert.throws(() => new Response(undefined));
    });

    it('error: premature end', function () {
      const response = new Response('application/http');
      assert.throws(() => response.push(null));
    });

    it('error: parse completed', function () {
      const response = new Response('application/http');
      response.parse(json.responses[0]);
      assert.deepEqual(response.json(), { name: 'item1' });
      assert.throws(() => response.push(null));
    });

    it('error: use incomplete json', function () {
      const response = new Response('application/http');
      const iterator = newlineIterator(json.responses[0]);
      response.push(iterator.next().value);
      response.push(iterator.next().value);
      assert.throws(() => response.json());
    });

    it('json', function () {
      const response = new Response('application/http');
      response.parse(json.responses[0]);
      assert.deepEqual(response.json(), { name: 'item1' });
    });

    it('json as text', function () {
      const response = new Response('application/http');
      response.parse(json.responses[0]);
      assert.equal(response.text(), '{\r\n\t"name": "item1"\r\n}');
    });

    it('error: use incomplete text', function () {
      const response = new Response('application/http');
      const iterator = newlineIterator(text.responses[0]);
      response.push(iterator.next().value);
      response.push(iterator.next().value);
      assert.throws(() => response.text());
    });

    it('text', function () {
      const response = new Response('application/http');
      response.parse(text.responses[0]);
      assert.equal(response.text(), 'text1');
    });

    it('text as json', function () {
      const response = new Response('application/http');
      response.parse(text.responses[0]);
      assert.throws(() => response.json());
    });
  });

  describe('mult-data', function () {
    it('text', function () {
      const boundary = 'batch_xvED97sOkyA_AAGGLqi8oGg';
      const data = new MultiData(boundary);
      data.append('entry1', JSON.stringify({ name: 'entry1' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      data.append('entry2', JSON.stringify({ name: 'entry2' }), {
        headers: { 'Content-Type': 'application/json' },
      });

      // parse multi-data body
      const parser = new Parser(`multipart/mixed; boundary=${boundary}`);
      parser.parse(data.toString());
      assert.deepEqual(
        parser.parts.map((part) => part.response.json()),
        [{ name: 'entry1' }, { name: 'entry2' }]
      );
    });
  });
});
