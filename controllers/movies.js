const Movie = require('../models/movie');
const ForbiddenError = require('../error/forbidden-error');
const NotFoundError = require('../error/not-found-error');
const IncorrectReqError = require('../error/incorrect-req-error');
const {
  notFoundMovieError,
  deleteMovieError,
  successDeleteMovie,
  dataError,
} = require('../utils/textError');

// возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

// Добавляет фильм
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectReqError(dataError));
        return;
      } next(err);
    });
};

// Удаляет фильм
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(notFoundMovieError);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(deleteMovieError);
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => {
            res.send({ message: successDeleteMovie });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectReqError(dataError));
        return;
      } next(err);
    });
};
