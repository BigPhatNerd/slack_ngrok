const express = require("express");
require('dotenv').config();
const request = require('request');
const app = express();
const PORT = process.env.PORT || 4390;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(require('./routes'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);

});

app.get('/', (req, res) => {
    res.send("Ngrok is working! Path Hit: " + req.url);
});


//