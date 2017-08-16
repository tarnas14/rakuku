require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json())

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

const voucherify = require('voucherify')({
    applicationId: process.env.APPLICATION_ID,
    clientSecretKey: process.env.CLIENT_SECRET_KEY
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
