const documentReady = new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))

const socket = io()
socket.on('connect', () => console.log('connected'))
socket.on('disconnect', () => console.log('disconnected'))

const addReward = ({tier, campaign, description, when}) => {
  const noRewards = document.getElementById('noRewardsYet')
  noRewards.className = noRewards.className.includes('hidden')
    ? noRewards.className
    : `${noRewards.className} hidden`

  const row = document.createElement('tr')
  const addToRow = text => {
    const el = document.createElement('td')
    el.appendChild(document.createTextNode(text))

    row.appendChild(el)
  }

  addToRow(when)
  addToRow(description)
  addToRow(campaign)
  addToRow(tier)

  const rewardsElement = document.getElementById('rewards')
  rewardsElement.appendChild(row)
}

const handleRewardEvent = ({when, reward, source}) => {
  console.log(when)
  addReward({
    when: (new Date(when)).toLocaleDateString('en-GB', {
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    }),
    tier: source.tier,
    campaign: source.id,
    description: `Your $${reward.gift.amount / 100} gift card: ${reward.code}`
  })
}

// socket.on('test_customer_id', handleRewardEvent)

const addLinks = ({rewardEveryRedemption, tieredRewardsRedemption}) => {
  document.getElementById('referralLinksContainer').className = ''

  const addLink = (element, link) => {
    element.href = link
    element.innerHTML = link
  }

  addLink(
    document.getElementById('rewardEveryRedemption'),
    `${document.location.origin}/referral?code=${encodeURIComponent(rewardEveryRedemption.code)}`
  )

  addLink(
    document.getElementById('tieredRewardsRedemption'),
    `${document.location.origin}/referral?code=${encodeURIComponent(tieredRewardsRedemption.code)}`
  )
}

documentReady.then(() => {
  document.getElementById('generateReferralLinks').addEventListener('click', e => {
    e.preventDefault()
    const email = document.getElementById('email').value
    fetch(`/getReferralLinks?email=${encodeURIComponent(email)}`).then(response => response.json())
      .then(response => {
        addLinks(response)
        return response
      })
      .then(response => console.log(response) || response)
      .then(({rewardEveryRedemption, tieredRewardsRedemption}) => {
        socket.on(rewardEveryRedemption.customerId, handleRewardEvent)
        socket.on(tieredRewardsRedemption.customerId, handleRewardEvent)
      })
  })
})
