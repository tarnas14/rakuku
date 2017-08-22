require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(bodyParser.json())

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
})

app.get('/referral', (request, response) => {
  response.sendFile(__dirname + '/views/referral.html')
})

const voucherify = require('voucherify')({
    applicationId: process.env.APPLICATION_ID,
    clientSecretKey: process.env.CLIENT_SECRET_KEY
});

io.on('connection', socket => {
  app.post('/reward', (request, response) => {
    const {type: eventType} = request.body
    if (eventType !== 'customer.rewarded') {
      response.status(400).end()
      return
    }
    
    const {
      created_at: createdAt,
      data: {object: {id: customerId}, related_object: reward},
      metadata: {source: {object_id: id, tier_name: tier, object_type: type}}
    } = request.body

    console.log('REWARD')
    console.log(JSON.stringify(request.body, null, 2))

    io.emit(customerId, {when: createdAt, reward, source: {id, tier, type}})
    response.status(200).end()
  })
})

app.post('/redeem', (request, response) => {
  const {code} = request.body

  voucherify.redemptions.redeem(code, {
    customer: {
      source_id: Date.now()
    },
    metadata: {
      from: 'voucherify referral example'
    }
  }).then(redemption => {
    if (redemption.result !== 'SUCCESS') {
      response.status(400).send(redemption.result).end()
      return
    }

    response.status(200).end()
  })
})

app.get('/referral/:code', (request, response) => {
  const {code} = request.params
  voucherify.vouchers.get(code)
    // .then(codeResponse => console.log(JSON.stringify(codeResponse, null, 2)) || codeResponse)
    .then(codeResponse => Promise.all([codeResponse, voucherify.customers.get(codeResponse.referrer_id)]))
    .then(([codeResponse, referrerResponse]) => {
      response.status(200).json({
        voucher: {
          type: codeResponse.type,
          discount: codeResponse.discount
        },
        referrer: {
          name: referrerResponse.name,
          email: referrerResponse.email
        }
      })
    })
})

app.get('/getReferralLinks', (request, response) => {
  const {email, name} = request.query
  const everyRedemptionPromise = voucherify.distributions.publish({
    campaign: 'rewardEveryRedemption',
    customer: {
      source_id: email,
      email,
      name
    },
    metadata: {
      source: 'voucherify referral example'
    }
  })
  // const nRedemptionsPromise = voucherif.distributions.publish('rewardEveryNRedemptions')
  const tieredRewardsRedemptionPromise = voucherify.distributions.publish({
    campaign: 'tieredReferralProgram',
    customer: {
      source_id: email,
      email,
      name
    },
    metadata: {
      source: 'voucherify referral example'
    }
  })

  Promise.all([everyRedemptionPromise, tieredRewardsRedemptionPromise]).then(([everyRedemptionResponse, tieredRewardsRedemption]) => {
    response.status(201).json({
      rewardEveryRedemption: {
        customerId: everyRedemptionResponse.customer_id,
        code: everyRedemptionResponse.voucher.code
      },
      tieredRewardsRedemption: {
        customerId: tieredRewardsRedemption.customer_id,
        code: tieredRewardsRedemption.voucher.code 
      }
    }).end()
  })
})

// listen for requests :)
var listener = server.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
