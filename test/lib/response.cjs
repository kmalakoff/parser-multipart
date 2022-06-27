module.exports = function response(type) {
  const boundary = 'batch_xvED97sOkyA_AAGGLqi8oGg';
  const text1 = 'text1';
  const json1 = `{\n\t"name": "item1"\n}`;

  const response1 = `HTTP/1.1 200 OK
Content-Type: application/${type}; charset=UTF-8
Date: Mon, 04 Oct 2021 04:39:37 GMT
Expires: Mon, 04 Oct 2021 04:39:37 GMT
Cache-Control: private, max-age=0
Content-Length: 12393

${type === 'json' ? json1 : text1}
`;
  const part1 = `Content-Type: application/http\n\n${response1}`;

  const text2 = 'text2';
  const json2 = `{\n\t"name": "item2"\n}`;
  const response2 = `HTTP/1.1 200 OK
Content-Type: application/${type}; charset=UTF-8
Date: Mon, 04 Oct 2021 04:39:37 GMT
Expires: Mon, 04 Oct 2021 04:39:37 GMT
Cache-Control: private, max-age=0
Content-Length: 6585

${type === 'json' ? json2 : text2}
`;
  const part2 = `Content-Type: application/http\n\n${response2}`;

  const body = `
--${boundary}
${part1}
--${boundary}
${part2}
--${boundary}--
`;

  return {
    headers: { 'content-type': `multipart/mixed; boundary=${boundary}` },
    body,
    boundary,
    parts: [part1, part2],
    responses: [response1, response2],
  };
};
