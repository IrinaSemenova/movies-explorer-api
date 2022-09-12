const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IncorrectReqError = require('../error/incorrect-req-error');
const ConflictError = require('../error/conflict-error');
const NotFoundError = require('../error/not-found-error');
const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/constant');
const {
  notFoundUserError,
  conflictEmailError,
  createUserDataError,
  dataError,
  successAuth,
} = require('../utils/textError');

// аутентификация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV, { expiresIn: '7d' });
      res.cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .send({ message: successAuth });
    })
    .catch(next);
};

// получение информации о пользователе
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// Создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then(() => res.send({
          name, email,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError(conflictEmailError));
          } else if (err.name === 'ValidationError') {
            next(new IncorrectReqError(createUserDataError));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

// Обновляет профиль
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError(notFoundUserError);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectReqError(dataError));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(conflictEmailError));
        return;
      }
      next(err);
    });
};
