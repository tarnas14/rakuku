const documentReady = new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))

const socket = io()
socket.on('connect', () => console.log('socket connected'))
socket.on('disconnect', () => console.log('socket disconnected'))
