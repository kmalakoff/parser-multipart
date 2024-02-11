function isError(obj) {
  return Object.prototype.toString.call(obj) === '[object Error]';
}
function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

function header(type) {
  if (type === 'error') {
    return `HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="https://accounts.google.com/", error="invalid_token"
Vary: Origin
Vary: X-Origin
Vary: Referer
Content-Type: application/json; charset=UTF-8`;
  }
  // biome-ignore lint/style/noUselessElse: <explanation>
  else {
    return `HTTP/1.1 200 OK
Content-Type: application/${type}; charset=UTF-8
Date: Mon, 04 Oct 2021 04:39:37 GMT
Expires: Mon, 04 Oct 2021 04:39:37 GMT
Cache-Control: private, max-age=0
Content-Length: 12393`;
  }
}

const headers = 'Content-Type: application/http\nContent-ID: response-0';
const boundary = 'batch_xvED97sOkyA_AAGGLqi8oGg';
const separator = `--${boundary}`;

module.exports = function response(data) {
  const responses = data.map((x) => {
    if (isError(x)) return [header('error'), '', JSON.stringify({ error: { message: x.message } }, null, 2)].join('\n');
    // biome-ignore lint/style/noUselessElse: <explanation>
    else if (isString(x)) return [header('text'), '', x].join('\n');
    // biome-ignore lint/style/noUselessElse: <explanation>
    else return [header('json'), '', JSON.stringify(x, null, 2)].join('\n');
  });
  const parts = responses.map((x) => [headers, '', x].join('\n'));
  
  const body = parts.reduce((m, x) => m.concat([x, separator]), [separator]).join('\n') + '--';

  return {
    boundary,
    headers: { 'content-type': `multipart/mixed; boundary=${boundary}` },
    body,
    parts,
    responses,
  };
};
