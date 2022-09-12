const router = require('express').Router();
const { createMovieValidate, movieIdValidate } = require('../middlewares/validator');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', createMovieValidate, createMovie);
router.delete('/movies/:movieId', movieIdValidate, deleteMovie);

module.exports = router;
