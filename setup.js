require('dotenv').config()
const request = require('request-promise-native')
const voucherify = require('voucherify')({
    applicationId: process.env.APPLICATION_ID,
    clientSecretKey: process.env.CLIENT_SECRET_KEY
})
const fs = require('fs')

const dataDir = './.data'
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

const setupCampaign = () => {
  const campaign = require('./campaign')
  const thisCampaign = voucherify.campaigns.create(campaign)

  thisCampaign.then(
    response => console.log(`Campaign ${campaign.name} has been succesfully set up`) || response,
    problem => console.log(`There was a problem setting up ${campaign.name}`, JSON.stringify(problem, null, 2))
  )
}

const setupVouchers = campaignResponse => {
    console.log(campaignResponse)
}

const products = require('./products')

const setupProducts = () => {
  const productCreationPromises = products.map(product => {
    const thisProduct = voucherify.products.create({
      name: product.name,
      source_id: product.id,
      metadata: {
        displayName: product.displayName,
        price: product.price
      }
    })

    thisProduct.then(
        prod => {
          console.log(`Product ${product.name} has been succesfully created`)
          const needsId = products.find(p => p.id === prod.source_id)
          needsId.voucherifyId = prod.id
        },
        problem => console.log(`There was a problem creating product ${product.name}`, JSON.stringify(problem, null, 2))
    )

    return thisProduct
  })

  return Promise.all(productCreationPromises).then(resp => console.log('ALL PRODUCTS SETUP') || resp)
}

setupCampaign().then(setupVouchers).then(setupProducts)
