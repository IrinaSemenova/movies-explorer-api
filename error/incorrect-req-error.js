// Переданы некорректные данные
class IncorrectReqError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = IncorrectReqError;
