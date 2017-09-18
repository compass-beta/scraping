'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const main = require('./main.js');

const PORT = process.env.port || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    main({q: req.query.q, ssrc: req.query.ssrc}).then(results => {
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send(results);
        res.end();
    }).catch(e => {
        console.error(e);
        res.end();
    });
});

app.listen(PORT, () => {
    console.log('Server listening ...');
});
