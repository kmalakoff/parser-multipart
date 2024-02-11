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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function (data: any[]): Response;
