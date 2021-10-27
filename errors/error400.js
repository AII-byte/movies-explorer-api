class error400 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = error400;
