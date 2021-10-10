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

export default function (type: string): Response;
