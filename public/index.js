const documentReady = new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))

const socket = window.io()
socket.on('connect', () => console.log('socket connected'))
socket.on('disconnect', () => console.log('socket disconnected'))

let state = {
  events: {},
  code: 'code will appear here'
}

const renderCode = (code) => { 
  document.getElementById('code').innerHTML = code
}

const filterDuplicatePublishes = events => events.reduce((accu, current) => {
  if (current.payload.type !== 'voucher.published') {
    return [...accu, current]
  }

  if (accu.find(inAccu => inAccu.payload.data.object.code === current.payload.data.object.code)) {
    return accu
  }
  
  return [...accu, current]
}, [])

const rollback = webhookRedemptionPayload => fetch('/rollback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: webhookRedemptionPayload.data.object.id,
    key: state.apiKey,
    secret: state.apiSecret
  })
})

const renderEvent = event => {
  const container = document.getElementById('webhookEvents')
  
  const handlers = {
    'voucher.published': ev => {
      const text = `${ev.payload.type.toUpperCase()}: ${ev.payload.data.object.code} (${ev.payload.data.object.type})`
      const row = document.createElement('div')
      row.className = 'row'
      const leftColumn = document.createElement('div')
      leftColumn.innerHTML = text
      leftColumn.className = 'column column-50'
      const rightColumn = document.createElement('div')
      rightColumn.className = 'column column-50'
      const button = document.createElement('button')
      button.innerHTML = 'show payload in console'
      button.className = 'button button-clear'
      button.addEventListener('click', () => console.log(ev.payload))
      
      rightColumn.appendChild(button)
      row.appendChild(leftColumn)
      row.appendChild(rightColumn)
      container.appendChild(row)
    },
    'redemption.succeeded': ev => {
      const text = `${ev.payload.type.toUpperCase()} (${ev.payload.data.object.voucher.code}) (redemptionId: ${ev.payload.data.object.id})`
      const row = document.createElement('div')
      row.className = 'row'
      const leftColumn = document.createElement('div')
      leftColumn.innerHTML = text
      leftColumn.className = 'column column-50'
      const rightColumn = document.createElement('div')
      rightColumn.className = 'column column-50'
      const consoleButton = document.createElement('button')
      consoleButton.innerHTML = 'show payload in console'
      consoleButton.className = 'button button-clear'
      consoleButton.addEventListener('click', () => console.log(ev.payload))
      
      const rollbackButton = document.createElement('button')
      rollbackButton.innerHTML = 'roll back'
      rollbackButton.className = 'button button-outline'
      rollbackButton.addEventListener('click', () => rollback(ev.payload).then(() => {
        ev.rolledBack = true
        rollbackButton.setAttribute('disabled', true)
      }))
      if (ev.rolledBack) {
        rollbackButton.setAttribute('disabled', true)
      }
      
      rightColumn.appendChild(rollbackButton)
      rightColumn.appendChild(consoleButton)
      row.appendChild(leftColumn)
      row.appendChild(rightColumn)
      container.appendChild(row)
    },
    'redemption.rollback.succeeded': ev => {
      const text = `${ev.payload.type.toUpperCase()} for redemption ${ev.payload.data.object.redemption}`
      const row = document.createElement('div')
      row.className = 'row'
      const leftColumn = document.createElement('div')
      leftColumn.innerHTML = text
      leftColumn.className = 'column column-50'
      const rightColumn = document.createElement('div')
      rightColumn.className = 'column column-50'
      const button = document.createElement('button')
      button.innerHTML = 'show payload in console'
      button.className = 'button button-clear'
      button.addEventListener('click', () => console.log(ev.payload))
      
      rightColumn.appendChild(button)
      row.appendChild(leftColumn)
      row.appendChild(rightColumn)
      container.appendChild(row)
    },
    'redemption.rollback.failed': ev => {
      const text = `${ev.payload.type.toUpperCase()} for redemption ${ev.payload.data.object.redemption}`
      const row = document.createElement('div')
      row.className = 'row'
      const leftColumn = document.createElement('div')
      leftColumn.innerHTML = text
      leftColumn.className = 'column column-50'
      const rightColumn = document.createElement('div')
      rightColumn.className = 'column column-50'
      const button = document.createElement('button')
      button.innerHTML = 'show payload in console'
      button.className = 'button button-clear'
      button.addEventListener('click', () => console.log(ev.payload))
      
      rightColumn.appendChild(button)
      row.appendChild(leftColumn)
      row.appendChild(rightColumn)
      container.appendChild(row)
    }
  }
  
  if (!handlers[event.payload.type]) {
    const text = `unhandled event :(`
    const row = document.createElement('div')
    row.className = 'row'
    const leftColumn = document.createElement('div')
    leftColumn.innerHTML = text
    leftColumn.className = 'column column-50'
    const rightColumn = document.createElement('div')
    rightColumn.className = 'column column-50'
    const button = document.createElement('button')
    button.innerHTML = 'show payload in console'
    button.className = 'button button-clear'
    button.addEventListener('click', () => console.log(event.payload))

    rightColumn.appendChild(button)
    row.appendChild(leftColumn)
    row.appendChild(rightColumn)
    container.appendChild(row)
    
    return
  }
  
  handlers[event.payload.type](event)
}

const renderEvents = events => {
  const eventsArray = Object.values(events).sort((a, b) => {
    var nameA = a.payload.created_at.toUpperCase(); // ignore upper and lowercase
    var nameB = b.payload.created_at.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  }).reverse()
  
  const container = document.getElementById('webhookEvents')
  while(container.firstChild) {
    container.firstChild.remove()
  }
  
  eventsArray.forEach(renderEvent)
}

const render = () => {
  renderCode(state.code)
  renderEvents(state.events)
}

socket.on('webhook-event', data => {
  state.events[data.id] = {
    payload: data
  }
  render()
})

documentReady.then(() => {
  const getCode = (key, secret, campaignName) => fetch(`/code?key=${key}&secret=${secret}&campaignName=${campaignName}`).then(r => r.json()).then(({voucher: {code}}) => {
    state.code = code
    render()
  })

  const submitButton = document.getElementById('submitVoucherifyInfo')
  submitButton.addEventListener('click', e => {
    e.preventDefault()

    state.apiKey = document.getElementById('api_key').value
    state.apiSecret = document.getElementById('api_secret').value
    const campaignName = document.getElementById('campaign_name').value

    getCode(state.apiKey, state.apiSecret, campaignName).then(() => {
      document.getElementById('redemptionTeaser').className += ' hidden'
      document.getElementById('redemption').className = 'container'
      document.querySelectorAll('fieldset').forEach(fieldset => {
        fieldset.setAttribute('disabled', true)
      })
    })
  })
  
  const redeemButton = document.getElementById('redeem')
  redeemButton.addEventListener('click', e => {
    e.preventDefault()

    redeemButton.setAttribute('disabled', 'disabled')
    fetch('/redeem', {
      headers: {
        'Content-Type': 'application/json'  
      },
      method: 'POST',
      body: JSON.stringify({
        code: state.code,
        key: state.apiKey,
        secret: state.apiSecret
      })
    }).then(() => {
      redeemButton.removeAttribute('disabled')      
    })
  })
})
