import { HttpStatus } from "../enums/http.status";

export class ResponseEntity<T> {
  constructor(
    public status: HttpStatus,
    public body?: T,
    public headers?: { [key: string]: string }
  ) {}

  public static ok<T>(
    body?: T,
    headers?: { [key: string]: string }
  ): ResponseEntity<T> {
    return new ResponseEntity(HttpStatus.OK, body, headers);
  }

  public static created<T>(
    body?: T,
    headers?: { [key: string]: string }
  ): ResponseEntity<T> {
    return new ResponseEntity(HttpStatus.CREATED, body, headers);
  }

  public static noContent<T>(headers?: {
    [key: string]: string;
  }): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.NO_CONTENT, undefined, headers);
  }

  public static badRequest<T>(
    body?: T,
    headers?: { [key: string]: string }
  ): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.BAD_REQUEST, body, headers);
  }

  public static unauthorized<T>(
    body?: T,
    headers?: { [key: string]: string }
  ): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.UNAUTHORIZED, body, headers);
  }

  public static forbidden<T>(
    body?: T,
    headers?: { [key: string]: string }
  ): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.FORBIDDEN, body, headers);
  }

  public static notFound<T>(
    body?: T,
    headers?: { [key: string]: string }
  ): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.NOT_FOUND, body, headers);
  }

  public static tooManyRequests<T>(
    body?: T,
    headers?: { [key: string]: string }
  ): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.TOO_MANY_REQUESTS, body, headers);
  }

  public static internalServerError<T>(
    body?: T,
    headers?: { [key: string]: string }
  ): ResponseEntity<T> {
    return new ResponseEntity<T>(
      HttpStatus.INTERNAL_SERVER_ERROR,
      body,
      headers
    );
  }
}
