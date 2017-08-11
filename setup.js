require('dotenv').config()
const request = require('request-promise-native')
const voucherify = require('voucherify')({
    applicationId: process.env.APPLICATION_ID,
    clientSecretKey: process.env.CLIENT_SECRET_KEY
})

const setupCampaign = () => {
  const campaign = require('./campaign')
  const thisCampaign = voucherify.campaigns.create(campaign)

  return thisCampaign.then(
    response => console.log(`Campaign ${campaign.name} has been succesfully set up`) || response,
    problem => console.log(`There was a problem setting up ${campaign.name}`, JSON.stringify(problem, null, 2))
  )
}

const range = n => Array.apply(null, Array(n)).map((_, i) => i)

const setupVouchers = campaignResponse => {
  const campaignName = campaignResponse.name

  const voucherPromises = range(10).map((_, i) => voucherify.campaigns.addVoucher(campaignName, {
      additional_info: 'voucherify-redemption-example',
      redemption: {
        quantity: null
      }
  }).then(response => {
    console.log(`voucher ${i} created`)
    if (i % 4 === 0) {
      return voucherify.vouchers.disable(response.code).then(() => console.log(`disabled ${i}`))
    }

    return response
  }))

  return Promise.all(voucherPromises).then(resp => console.log('ALL VOUCHERS CREATED') || resp)
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
// setupVouchers({name: 'voucherify-redemption-example'})
setupCampaign().then(setupVouchers).then(setupProducts)
