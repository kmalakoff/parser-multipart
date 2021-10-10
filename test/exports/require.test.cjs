/* eslint-disable @typescript-eslint/no-var-requires */
const { assert } = require("chai");
const { Parser, Part, Response } = require("parser-multipart");
const response = require("../lib/response.cjs");

const json = response("json");

describe("exports .cjs", function () {
  it("MultiData", function () {
    const parser = new Parser(json.headers["content-type"]);
    parser.parse(json.body);
    const result = parser.parts.map((part) => part.response.json());
    assert.deepEqual(result, [{ name: "item1" }, { name: "item2" }]);
  });

  it("Part", function () {
    const part = new Part();
    part.parse(json.parts[0]);
    assert.deepEqual(part.response.json(), { name: "item1" });
  });

  it("Response", function () {
    const response = new Response();
    response.parse(json.responses[0]);
    assert.deepEqual(response.json(), { name: "item1" });
  });
});
