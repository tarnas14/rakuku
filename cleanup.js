require('dotenv').config()
const request = require('request-promise-native')
const voucherify = require('voucherify')({
    applicationId: process.env.APPLICATION_ID,
    clientSecretKey: process.env.CLIENT_SECRET_KEY
})
const campaign = require('./campaign')

const removeCampaigns = () => {
  const promises = [campaign].map(campaign => request({
    method: 'DELETE',
    json: true,
    headers:{
      'Content-Type': 'application/json',
      'X-App-Id': process.env.APPLICATION_ID,
      'X-App-Token': process.env.CLIENT_SECRET_KEY
    },
    uri: `https://api.voucherify.io/v1/campaigns/${campaign.name}?force=true&delete_campaign_validation_rules=true&delete_voucher_validation_rules=true`
  }).then(() => {}, problem => console.log('problem', campaign.name, JSON.stringify(problem, null, 2))))

  return Promise.all(promises).then(() => console.log('campaigns removed (with validation rules)'))
}

const productIdsForThisDemo = require('./products').map(product => product.id)
const removeProducts = () => voucherify.products.list().then(response => {
    const products = response.products
    
    return Promise.all(products.filter(product => productIdsForThisDemo.includes(product.source_id)).map(product => request({
      method: 'DELETE',
      json: true,
      headers:{
        'Content-Type': 'application/json',
        'X-App-Id': process.env.APPLICATION_ID,
        'X-App-Token': process.env.CLIENT_SECRET_KEY
      },
      uri: `https://api.voucherify.io/v1/products/${product.id}?force=true`
    })))
  }).then(() => console.log('products removed'))
 || resp

removeCampaigns().then(removeProducts)
