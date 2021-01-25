const express = require('express');

const app  = express();
const port = 8000;

const Admin = (req, res) => {
    res.send("Welcome to Admin dashboard!!");
}

const isLoggin = (req, res, next) => {
    console.log("is Logged in!!");
    next();
}

app.get('/admin', isLoggin, Admin);

app.get('/', (req, res) => res.send("hello world!!"));

app.listen(port, () => console.log(`App is listening on port ${port}`));