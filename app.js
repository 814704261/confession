const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./route/router');

app.use(express.static('./public/'));
app.use('/upload', express.static('./upload/'));

app.use(bodyParser.urlencoded({ extends: true }));
app.use(bodyParser.json());

app.use(cookieParser());

app.engine('html', require('express-art-template'));
app.set('views', './public/');

app.use(router);


app.listen(3000, (err) => {
    if (!err) {
        console.log('server is running');
    }
});