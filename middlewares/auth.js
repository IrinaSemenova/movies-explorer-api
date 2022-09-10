const jwt = require('jsonwebtoken');

const NotAuthorizationError = require('../error/notauthorization-error');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.cookies;

  if (!authorization) {
    next(new NotAuthorizationError('Необходима авторизация'));
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;
  // попытаемся верифицировать токен
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new NotAuthorizationError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
