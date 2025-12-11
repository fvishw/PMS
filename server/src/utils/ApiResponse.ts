class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message = "Success") {
    this.statusCode = statusCode;
    Object.assign(this, data); // spread data properties to the instances
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
