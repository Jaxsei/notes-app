class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message: string | object = 'Something went wrong',
    errors: any[] = [],
    stack = ''
  ) {
    super(typeof message === "string" ? message : JSON.stringify(message));
    this.statusCode = statusCode;
    this.data = null;
    this.message = this.message; // Already assigned by super()
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
