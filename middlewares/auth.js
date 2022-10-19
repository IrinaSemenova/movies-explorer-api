const jwt = require('jsonwebtoken');

const NotAuthorizationError = require('../error/notauthorization-error');

const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/constant');
const { reqAuthError } = require('../utils/textError');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.cookies;

  if (!authorization) {
    next(new NotAuthorizationError(reqAuthError));
  }
  // извлечём токен
  const token = authorization.replace('Bearer', '');
  let payload;
  // попытаемся верифицировать токен
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new NotAuthorizationError(reqAuthError));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
