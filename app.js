require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const limiter = require('./utils/rateLimit');
const router = require('./routes');
const serverError = require('./middlewares/serverError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { corsOptions } = require('./utils/corsOptions');

const {
  PORT,
  MONGO_DEV,
  MONGO_PROD,
  NODE_ENV,
} = require('./utils/constant');

const app = express();
mongoose.connect(NODE_ENV === 'production' ? MONGO_PROD : MONGO_DEV);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

app.use(cors(corsOptions)); // options after front
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);
app.use(helmet());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчики ошибок
app.use(serverError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
