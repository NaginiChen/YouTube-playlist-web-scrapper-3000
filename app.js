const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 8000;

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use('/', require('./routes'));

app.listen(PORT, function () {
    console.log('Listening...');
})

app.use((req, res) => {
    res.status(404).send('Error 404: Unknown Request');
});

module.exports = app;