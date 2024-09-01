const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//set env path
require('dotenv').config();

let app = express();

app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors({ origin: "*", credentials: true }))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Pragma", "no-cache");
    res.header('Access-Control-Allow-Methods', "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
})

// Root route of express app
app.get("/", (req, res) => {
    res.send("Welcome to task manager");
});


app.listen(process.env.PORT, function () {
    console.log('Example app listening on port ' + process.env.PORT + '!')
});

module.exports = app;