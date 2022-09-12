const corsOptions = {
  origin: [
    'http://movie.semenova.nomorepartiesxyz.ru',
    'https://movie.semenova.nomorepartiesxyz.ru',
    'https://localhost:3001',
    'http://localhost:3001',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = { corsOptions };
