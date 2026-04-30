export class SdkError extends Error {
  code?: string;
  info?: any;
  constructor(message: string, code?: string, info?: any) {
    super(message);
    this.name = "SdkError";
    this.code = code;
    this.info = info;
  }
}

export class NetworkError extends SdkError {
  constructor(message = "Network error", info?: any) {
    super(message, "NETWORK_ERROR", info);
  }
}

export class AuthenticationError extends SdkError {
  constructor(message = "Authentication failed", info?: any) {
    super(message, "AUTH_ERROR", info);
  }
}
