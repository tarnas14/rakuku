$(() => {
  const Voucherify = window.Voucherify;

  Voucherify.initialize(
    '75dc20ca-b116-4b99-8684-27ef875275fb',
    'eebb437c-a995-43a0-8cc1-4734020ecf31'
  );

  const vouchersListPromise = new Promise(resolve => Voucherify.listVouchers({
    campaign: 'voucherify-redemption-example',
    limit: 10
  }, response => resolve(response.vouchers)))

  const chunk = (array, chunkSize) => Array.from(Array(Math.ceil(array.length/chunkSize)), (_,i)=>array.slice(i*chunkSize,i*chunkSize+chunkSize))

  vouchersListPromise
    .then(vouchers => {
      const indicatorWrapper = document.getElementById('loadingIndicatorWrapper')
      indicatorWrapper.parentNode.removeChild(indicatorWrapper)
    
      const container = document.getElementById('exampleVouchers')
      const chunks = chunk(vouchers, 5)
      
      const elements = chunks.map(chunk => {
        const row = document.createElement('div')
        row.className = 'row'
        
        chunk.map(voucher => {
          const voucherElement = document.createElement('div')
          voucherElement.className = `column ${voucher.active ? 'active' : 'notActive'}`
          const span = document.createElement('span')
          span.appendChild(document.createTextNode(voucher.code))
          voucherElement.appendChild(span)

          return voucherElement
        }).forEach(el => row.appendChild(el))
        
        return row
      })
      
      elements.forEach(el => container.appendChild(el))
    })

  const success = () => {
    const container = document.getElementById('result')
    const info = document.createElement('p')
    info.className = 'success'
    info.appendChild(document.createTextNode('Voucher redeemed!'))
    container.appendChild(info)
  }

  const error = text => {
    const container = document.getElementById('result')
    const info = document.createElement('p')
    info.className = 'error'
    info.appendChild(document.createTextNode(text || 'Redemption failed'))
    container.appendChild(info)
  }

  const hideLastResult = () => {
    const container = document.getElementById('result')
    if (container.children.length === 0) {
      return
    }

    container.removeChild(container.children[0]);
  }

  document.getElementById('simple-redeem').addEventListener('click', e => {
    e.preventDefault()
    hideLastResult()

    const code = document.getElementById('simple-voucherCode').value

    fetch('/redeem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    }).then(response => {
      if (response.status === 200) {
        success()
        return
      }

      error(response.statusText)
    })
  })

  document.getElementById('full-redeem').addEventListener('click', e => {
    e.preventDefault()
    hideLastResult()

    const code = document.getElementById('full-voucherCode').value
    const email = document.getElementById('full-email').value
    const name = document.getElementById('full-name').value
    const amount = document.getElementById('full-amount').value

    fetch('/redeem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, email, name, amount })
    }).then(response => {
      if (response.status === 200) {
        success()
        return
      }

      error(response.statusText)
    })
  })

  document.querySelectorAll('.hide').forEach(hideButton => {
    hideButton.addEventListener('click', e => {
      const target = e.target

      const toToggle = target.getAttribute('data-toggle').split(',')

      toToggle.map(id => document.getElementById(id)).forEach(toggled => {
        if (toggled.className.includes('hidden')) {
          toggled.className = toggled.className.replace('hidden', '')
          return
        }

        toggled.className = toggled.className + 'hidden'
      })
    })
  })
})
