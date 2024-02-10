import assert from 'assert';
import { Part } from 'parser-multipart';
import response from '../lib/response.cjs';

const dataJSON = response([{ name: 'item1' }, { name: 'item2' }]);

describe('Part', function () {
  it('error: missing content type', function () {
    const part = new Part();
    const parts = dataJSON.parts[0].split('\n');
    assert.throws(() => part.parse(parts.splice(1).join('\n')));
  });

  it('error: premature end', function () {
    const part = new Part();
    assert.throws(() => part.push(null));
  });

  it('error: parse completed', async function () {
    const part = new Part();
    part.parse(dataJSON.parts[0]);
    assert.deepEqual(await part.response.json(), { name: 'item1' });
    assert.throws(() => part.push(null));
  });

  it('error: unexpected content-type', function () {
    const part = new Part();
    assert.throws(() => part.parse('Content-Type: unexpected\n\nHTTP/1.1 200 OK\nContent-Type: application/text; charset=UTF-8\n\ntext\n'));
  });

  it('json', async function () {
    const part = new Part();
    part.parse(dataJSON.parts[0]);
    assert.deepEqual(await part.response.json(), { name: 'item1' });
  });
});
