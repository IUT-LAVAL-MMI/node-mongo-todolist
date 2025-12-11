class RestException extends Error {
  constructor(reason, status = 500) {
    super(reason);
    this.status = status;
  }
}

export { RestException };