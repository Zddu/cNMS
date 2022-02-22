class GlobalError extends Error {
  code: number;
  errorName: string;
  msg: string;
  constructor(code, msg) {
    super(msg);
    this.code = code;
    this.msg = msg;
    this.errorName = 'GlobalError';
  }
}

export default GlobalError;
