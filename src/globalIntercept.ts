import ErrorCode from './consts';

class GlobalIntercept {
  code: ErrorCode;
  data: any;
  message: string;

  setCode(code: ErrorCode) {
    this.code = code;
    return this;
  }

  setData(data: any) {
    this.data = data;
    return this;
  }

  setMessage(message: string) {
    this.message = message;
    return this;
  }

  public success(data?: any) {
    this.code = ErrorCode.SUCCESS;
    this.data = data || {};
    return this;
  }

  public error(code: ErrorCode, message: string) {
    this.code = code;
    this.message = message;
    return this;
  }
}

export default GlobalIntercept;
