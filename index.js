'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const middleware = require('./middleware');
const book = require('./controllers/routes/book');
let config = require('config');

async function mongoConnect(){
    try{
        await mongoose.connect(config.db, {
            user: 'localmongouser',
            pass: 'localmongopwd',
            dbName: 'nodetestdb'
        });
        console.log("Connected to Mongo!!");
    }catch(err){
        console.log(err);
    }
}

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

let userObj = {};

app.post('/user/create', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(404).json({
            status: 200,
            message: 'Name and Email are required'
        });
    } else {
        userObj = { name, email };
        fs.appendFile(`${__dirname}/user.json`, JSON.stringify(userObj), 'utf-8', (err) => {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: userObj
            });
        });
    }
});

app.get('/test/:id', middleware.isLoggedIn, function (req, res) {
    res.json({
        status: 200,
        message: 'Success',
        data: {
            id: req.params.id
        }
    });
});

app.route('/book').get(book.getBooks).post(book.postBook);
app.route('/book/:id').get(book.getBook).put(book.updateBook).delete(book.deleteBook);

app.listen(3000, () => {
    mongoConnect();
    console.log("App is listening on PORT 3000");
});
module.exports = app