"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequest = badRequest;
exports.unauthorized = unauthorized;
exports.forbidden = forbidden;
exports.pageNotFound = pageNotFound;
exports.tooManyRequest = tooManyRequest;
exports.internalServerError = internalServerError;
exports.successOk = successOk;
exports.successCreated = successCreated;
/**
 * The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
 */
function badRequest(req, res, data = "none", msg = "Bad request, malformed JSON") {
    res.status(400).json({ status: msg, result: data });
}
/**
 * Although the HTTP standard specifies 'unauthorized', semantically this response means 'unauthenticated'. That is, the client must authenticate itself to get the requested response.
 */
function unauthorized(req, res, data = "none", msg = "Unauthorized and unknown") {
    res.status(401).json({ status: msg, result: data });
}
/**
 * The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.
 */
function forbidden(req, res, data = "none", msg = "Forbidden") {
    res.status(403).json({ status: msg, result: data });
}
/**
 * The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.
 */
function pageNotFound(req, res, data = "none", msg = "Not found") {
    res.status(404).json({ status: msg, result: data });
}
/**
 * Rate limiter for API requests
 */
function tooManyRequest(req, res, data = "Try again after some time. Rate limited", msg = "Too many requests") {
    res.status(429).json({ status: msg, result: data });
}
/**
 * The server has encountered a situation it does not know how to handle.
 */
function internalServerError(req, res, data = "none", msg = "Server side error") {
    res.status(500).json({ status: msg, result: data });
}
/**
 * The request succeeded.
 */
function successOk(req, res, data = {}, msg = "Request successful!") {
    res.status(200).json({ status: msg, result: data });
}
/**
 * The request succeeded, and a new resource was created as a result.
 */
function successCreated(req, res, data = {}, msg = "Created!") {
    res.status(201).json({ status: msg, result: data });
}
