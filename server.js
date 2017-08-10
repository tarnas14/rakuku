require('dotenv').config();
const express = require('express');
const voucherifyClient = require('voucherify');
const app = express();
const bodyParser = require('body-parser');

const debug = false

const voucherify = voucherifyClient({
    applicationId: process.env.APPLICATION_ID,
    clientSecretKey: process.env.CLIENT_SECRET_KEY
});

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/redeem', function (request, response) {
  const {code, name, email, amount} = request.body

  console.log('VALIDATING', code)
  voucherify.validations.validateVoucher(code).then(
    validationResponse => {
      if (!validationResponse.valid) {
        response.statusMessage = 'Validation failed: ' + validationResponse.reason
        response.status(400).end()
        return
      }

      const additionalRedemptionParameters = (name || email || amount) && {
        customer: {
          name,
          email
        },
        order: {
          amount: Number(amount) * 100
        }
      }

      console.log('REDEEMING', code)
      debug && console.log('WITH PARAMS', JSON.stringify(additionalRedemptionParameters, null, 2))
      voucherify.redemptions.redeem(code, additionalRedemptionParameters).then(
        redemptionResponse => {
          debug && console.log('REDEMPTION RESPONSE', JSON.stringify(redemptionResponse, null, 2))

          if (redemptionResponse.result !== 'SUCCESS') {
            response.statusMessage = 'Redemption failed with result ' + redemptionResponse.result
            response.status(400).end()
            return
          }

          response.status(200).end()
        },
        err => {
          console.log(err)
          response.statusMessage = 'Redemption failed unexpectedly'
          response.status(400).end()
        }
      )
    },
    err => {
      console.log(err)
      response.statusMessage = 'Validation failed unexpectedly'
      response.status(400).end()
    }
  )
})

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

