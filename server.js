if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const apiRouter = require('./routes/api');
const cors = require('cors');

let db;

if(process.env.NODE_ENV !== 'production') {
  db = config.DB.test
} else {

  db = process.env.db;

}


app.use(cors());


mongoose.Promise = Promise;

mongoose.connect(db, {useMongoClient: true})
  .then(() => console.log('successfully connected to', process.env.NODE_ENV))
  .catch(err => console.log('connection failed', err));
  
  app.use(bodyParser.json());
  
  app.use('/api', apiRouter);

  app.use('/*', (req, res) => {
    res.status(404).send('Page not found');
  });
  app.use((err, req, res, next) => {
    res.status(500).send({err});
  });

module.exports = app;