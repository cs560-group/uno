require('dotenv').config()

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.setMaxListeners(0)
app.use(express.static('app/static'))
app.use(require('./app/routes'))

const gameController = require('./app/controllers/GameController')

//socket connection handlers
io.on('connection', socket => {
    socket.on('newplayer', name => {
        gameController.handleConnection(io, socket, name)
    })
})

http.listen(process.env.PORT, () => {
    console.log("server started on port ", process.env.PORT)
})