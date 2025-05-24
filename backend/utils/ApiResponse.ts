class ApiResponse<T = any> {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly data: T;
  public readonly message: string;

  constructor(
    statusCode: number,
    data: T,
    message: string = 'Success'
  ) {
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
