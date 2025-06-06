class ApiError extends Error {
    constructor(statusCode, message = 'Something went wrong', errors = [], stack = '') {
        super(typeof message === "string" ? message : JSON.stringify(message));
        this.statusCode = statusCode;
        this.data = null;
        this.message = this.message; // Already assigned by super()
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError };
//# sourceMappingURL=ApiError.js.map