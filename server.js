require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const voucherifyPackage = require('voucherify')

const {CAMPAIGN_NAME} = process.env

app.use(bodyParser.json())

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
})

io.on('connection', socket => {
  app.post('/webhooks', (request, response) => {
    io.emit('webhook-event', request.body)
    
    console.log('WEBHOOK')
    console.log(JSON.stringify(request.body, null, 2))
    
    response.status(200).end()
  })
})

app.get('/code', (request, response) => {
  const {key, secret, campaignName} = request.query
  const voucherify = voucherifyPackage({
      applicationId: key,
      clientSecretKey: secret
  });

  voucherify.distributions.publish(campaignName).then(res => {
    response.status(201).json(res)
  })  
})

app.post('/redeem', (request, response) => {
  const {code, key, secret} = request.body
  const voucherify = voucherifyPackage({
      applicationId: key,
      clientSecretKey: secret
  });
  
  voucherify.redemptions.redeem(code).then(redemptionResponse => {
    console.log(JSON.stringify(redemptionResponse))
    response.status(200).end()
  })
})

app.post('/rollback', (request, response) => {
  const {id: redemptionId, key, secret} = request.body
  const voucherify = voucherifyPackage({
      applicationId: key,
      clientSecretKey: secret
  });
  
  voucherify.redemptions.rollback(redemptionId).then(rollbackResponse => {
    console.log(JSON.stringify(rollbackResponse))
    response.status(200).end()
  })
})

// listen for requests :)
var listener = server.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
