const documentReady = new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))

const codeRegex = /^\?code=(.*)$/
const [, code] = document.location.search.match(codeRegex)

const getReferralVoucher = documentReady.then(() => fetch(`/referral/${code}`).then(r => r.json()).then(response => {
  document.querySelector('.loading-indicator-wrapper').className += ' hidden'
  document.getElementById('referrer').innerHTML = response.referrer.name || response.referrer.email

  document.querySelector('main').className = ''

  return response.voucher
}))

getReferralVoucher.then(referralVoucher => {
  const Voucherify = window.Voucherify

  const discounted = Voucherify.utils.calculatePrice(50, referralVoucher)

  document.getElementById('discountedPrice').innerHTML = `$${discounted.toFixed(2)}`

  const redeemButton = document.getElementById('redeem')
  redeemButton.addEventListener('click', e => {
    e.preventDefault()
    redeemButton.setAttribute('disabled', true)
    const timer = setTimeout(() => redeemButton.removeAttribute('disabled'), 2000)

    fetch('/redeem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({code})
    }).then(response => {
      clearTimeout(timer)
      document.getElementById('success').className = ''
    })
  })
})
