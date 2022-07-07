require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const errorHendler = require('./middleware/ErrorHandlingMiddleware');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// обработка ошибок всегда добавляется в конец!
app.use(errorHendler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`SERVERS STARTED ON PORT ${PORT}`);
    });
  } catch(e) {
    console.log(e);
  };
};

start();
