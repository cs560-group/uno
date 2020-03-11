require('dotenv').config()

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.setMaxListeners(0)
app.use(express.static('app/static'))

const gameController = require('./controllers/GameController')

//socket connection handlers
io.on('connection', socket => {
    socket.on('newplayer', name => {
        gameController.handleConnection(io, socket, name)
    })
})
const port = process.env.PORT || 8080
http.listen(port, () => {
    console.log("server started on port", port)
})