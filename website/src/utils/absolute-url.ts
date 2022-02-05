import { IncomingMessage } from "http";

export function getAbsoluteUrl(req?: IncomingMessage) {
  let host = process.env.VERCEL_URL ?? `localhost:3000`;

  if (req?.headers?.host) {
    host = req.headers.host;
  }
  if (typeof window != "undefined") {
    host = window.location.host;
  }
  if (typeof req?.headers["x-forwarded-host"] == "string") {
    host = req.headers["x-forwarded-host"];
  }

  let protocol = /^localhost(:\d+)?$/.test(host) ? "http:" : "https:";

  if (typeof req?.headers["x-forwarded-proto"] == "string") {
    protocol = `${req.headers["x-forwarded-proto"]}:`;
  }

  return {
    protocol,
    host,
    origin: `${protocol}//${host}`,
  };
}
