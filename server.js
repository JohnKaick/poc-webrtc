const express = require('express.io')
const app = express()
app.http().io();
const port = 3000
console.log('server started')

// Rota para o arquivo html
app.get('/', (req, res) => {
    res.render('index.ejs')
})

// Fica informando novos usuários na sala
app.io.route('ready', (req) => {
    req.io.join(req.data.chat_room)
    req.io.join(req.data.signal_room)
    app.io.room(req.data).broadcast('announce', {
        message: 'Novo usuário ' + req.data + 'na sala.'
    })
})

// Enviar mensagens novas para a sala
app.io.route('send', (req) => {
    app.io.room(req.data.room).broadcast('message', {
        message: req.data.message,
        author: req.data.author
    })
})

// Informando o status da conexão do webrtc na sala
app.io.route('signal', (req) => {
    app.io.room(req.data.room).broadcast('signaling_message', {
        type: req.data.type,
        message: req.data.message,
    })
})


app.listen(port)