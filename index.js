const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const middleware = require('./middleware');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

let userObj = {};

app.post('/user/create', (req, res)=>{
    const {name, email} = req.body;
    if(!name || !email){
        res.status(404).json({
            status: 200,
            message: 'Name and Email are required'
        });
    }else{
        userObj = {name, email};
        fs.appendFile(`${__dirname}/user.json`, JSON.stringify(userObj), 'utf-8', (err) => {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: userObj
            });
        });
    }
});

// app.use();
app.get('/test/:id', middleware.isLoggedIn, (req, res)=>{
    res.json({
        status: 200,
        message:'Success',
        data: {
            id: req.params.id
        }
    });
});



var server = app.listen(3000, ()=>{
    console.log("App is listening on PORT 3000");
});
module.exports = server