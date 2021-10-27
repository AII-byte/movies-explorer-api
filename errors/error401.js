class error401 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = error401;
