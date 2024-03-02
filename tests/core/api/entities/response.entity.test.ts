import { ResponseEntity } from "@core/api/entities/response.entity";
import { HttpStatus } from "@core/api/enums/http.status";

describe("ResponseEntity", () => {
  const body = "test body";
  const headers = { "test-header": "test value" };

  it("should create an OK response", () => {
    const response = ResponseEntity.ok(body, headers);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toBe(body);
    expect(response.headers).toBe(headers);
  });

  it("should create a CREATED response", () => {
    const response = ResponseEntity.created(body, headers);
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toBe(body);
    expect(response.headers).toBe(headers);
  });

  it("should create a NO CONTENT response", () => {
    const response = ResponseEntity.noContent(headers);
    expect(response.status).toBe(HttpStatus.NO_CONTENT);
    expect(response.body).toBeUndefined();
    expect(response.headers).toBe(headers);
  });

  it("should create a BAD REQUEST response", () => {
    const response = ResponseEntity.badRequest(body, headers);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toBe(body);
    expect(response.headers).toBe(headers);
  });

  it("should create an UNAUTHORIZED response", () => {
    const response = ResponseEntity.unauthorized(body, headers);
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body).toBe(body);
    expect(response.headers).toBe(headers);
  });

  it("should create a FORBIDDEN response", () => {
    const response = ResponseEntity.forbidden(body, headers);
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
    expect(response.body).toBe(body);
    expect(response.headers).toBe(headers);
  });

  it("should create a NOT FOUND response", () => {
    const response = ResponseEntity.notFound(body, headers);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body).toBe(body);
    expect(response.headers).toBe(headers);
  });

  it("should create a TOO MANY REQUESTS response", () => {
    const response = ResponseEntity.tooManyRequests(body, headers);
    expect(response.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
    expect(response.body).toBe(body);
    expect(response.headers).toBe(headers);
  });

  it("should create an INTERNAL SERVER ERROR response", () => {
    const response = ResponseEntity.internalServerError(body, headers);
    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body).toBe(body);
    expect(response.headers).toBe(headers);
  });
});
