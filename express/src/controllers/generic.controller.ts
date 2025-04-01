import express from "express";

/**
 * The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
 */
export function badRequest(
  req: express.Request,
  res: express.Response,
  data: string = "none",
  msg: string = "Bad request, malformed JSON"
) {
  res.status(400).json({ status: msg, result: data });
}

/**
 * Although the HTTP standard specifies 'unauthorized', semantically this response means 'unauthenticated'. That is, the client must authenticate itself to get the requested response.
 */
export function unauthorized(
  req: express.Request,
  res: express.Response,
  data: string = "none",
  msg: string = "Unauthorized and unknown"
) {
  res.status(401).json({ status: msg, result: data });
}

/**
 * The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.
 */
export function forbidden(
  req: express.Request,
  res: express.Response,
  data: string = "none",
  msg: string = "Forbidden"
) {
  res.status(403).json({ status: msg, result: data });
}

/**
 * The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.
 */
export function pageNotFound(
  req: express.Request,
  res: express.Response,
  data: string = "none",
  msg: string = "Not found"
) {
  res.status(404).json({ status: msg, result: data });
}

/**
 * Rate limiter for API requests 
 */
export function tooManyRequest(
  req: express.Request,
  res: express.Response,
  data: string = "Try again after some time. Rate limited",
  msg: string = "Too many requests"
) {
  res.status(429).json({ status: msg, result: data });
}

/**
 * The server has encountered a situation it does not know how to handle.
 */
export function internalServerError(
  req: express.Request,
  res: express.Response,
  data: string = "none",
  msg: string = "Server side error"
) {
  res.status(500).json({ status: msg, result: data });
}

/**
 * The request succeeded.
 */
export function successOk(
  req: express.Request,
  res: express.Response,
  data: {} = {},
  msg: string = "Request successful!"
) {
  res.status(200).json({ status: msg, result: data });
}

/**
 * The request succeeded, and a new resource was created as a result.
 */
export function successCreated(
  req: express.Request,
  res: express.Response,
  data: {} = {},
  msg: string = "Created!"
) {
  res.status(201).json({ status: msg, result: data });
}