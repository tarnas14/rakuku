const documentReady = new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))

const socket = io()
socket.on('connect', () => console.log('socket connected'))
socket.on('disconnect', () => console.log('socket disconnected'))

let state = {}

const _addRedemptionEvent = (redemption) => {
  
}

documentReady.then(() => {
  document.getElementById('redeem').addEventListener('click', () => {
    _addRedemptionEvent({
    
    })
  })
})
