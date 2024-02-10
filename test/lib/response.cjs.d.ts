/* eslint-disable @typescript-eslint/no-explicit-any */

interface HeadersObject {
  [key: string]: string;
}

interface Response {
  headers: HeadersObject;
  body: string;
  boundary: string;
  parts: string[];
  responses: string[];
}

export default function (data: any[]): Response;
