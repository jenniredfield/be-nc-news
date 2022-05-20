/* eslint-disable no-console */
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const apiRouter = require('./routes/api');
const cors = require('cors');
const path = require('path');

let db =
    process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev'
        ? config.DB[process.env.NODE_ENV]
        : process.env.db;

app.use(cors());

app.use(express.static('public'));

mongoose.Promise = Promise;

mongoose
    .connect(db)
    .then(() => console.log('successfully connected to', process.env.NODE_ENV))
    .catch((err) => console.log('connection failed', err));

app.use(bodyParser.json());

app.get('/', function (_req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use('/api', apiRouter);

app.use('/*', (_req, res) => {
    res.status(404).send('Page Not Found');
});

app.use((err, _req, res) => {
    if (err.statusCode) {
        return res.status(err.statusCode).send({ message: err.message });
    } else {
        res.status(500).send({ err });
    }
});

module.exports = app;
