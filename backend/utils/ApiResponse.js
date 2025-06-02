class ApiResponse {
    constructor(statusCode, data, message = 'Success') {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode >= 200 && statusCode < 400;
    }
    toJSON() {
        return {
            statusCode: this.statusCode,
            success: this.success,
            data: this.data,
            message: this.message,
        };
    }
}
export { ApiResponse };
//# sourceMappingURL=ApiResponse.js.map