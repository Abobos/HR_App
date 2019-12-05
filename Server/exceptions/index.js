// const setPrototypeOf = (payload: objectLiteral, parent: InternalServerError) =>
//   Object.setPrototypeOf(payload, parent);

export class InternalServerError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.name = this.constructor.name;

    this.message = message;
    this.statusCode = code;
  }
}

export class AuthenticationError extends InternalServerError {
  constructor(message, code = 401) {
    super(message, code);

    this.name = this.constructor.name;
  }
}

export class ForbiddenError extends InternalServerError {
  constructor(message, code = 403) {
    super(message, code);

    this.name = this.constructor.name;
  }
}

export class NotFoundError extends InternalServerError {
  constructor(message, code = 404) {
    super(message, code);
    this.name = this.constructor.name;
  }
}

export class ConflictError extends InternalServerError {
  constructor(message, code = 409) {
    super(message, code);

    this.name = this.constructor.name;
  }
}
