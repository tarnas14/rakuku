const documentReady = new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))

const addLinks = ({rewardEveryRedemption}) => {
  document.getElementById('referralLinksContainer').className = ''

  const every = document.getElementById('rewardEveryRedemption')
  const everyRedemptionRewardLink = `${document.location.origin}/referral?code=${encodeURIComponent(rewardEveryRedemption)}`
  every.href = everyRedemptionRewardLink
  every.innerHTML = everyRedemptionRewardLink
}

documentReady.then(() => {
  document.getElementById('generateReferralLinks').addEventListener('click', e => {
    e.preventDefault()
    const email = document.getElementById('email').value
    fetch(`/getReferralLinks?email=${encodeURIComponent(email)}`).then(response => response.json()).then(addLinks)
  })
})
