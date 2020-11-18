const express = require('express');
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')


const port = process.env.PORT || 3000
app.set('port', port)

http.listen(port, () => {
    console.log('listening on port ' + port)
});

// view engine setup
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'assets')));

let namespaces = ["One", "Two", "Three"]

app.get('/chat/:ns', (req, res) => {
    res.render('chat')
})

app.get('/lobby', (req, res) => {
	res.render('lobby', {namespaces: namespaces})
})


for (let i=0; i<namespaces.length; i++) {
	const ns = io.of("/" + namespaces[i])
	
  let users = {}
	

	ns.on('connection', socket => {
    console.log('connection: ', socket.id);

    socket.on('login', name => {
			users[socket.id] = name
			
			socket.broadcast.emit('message', {
				from: 'Server',
				message: `${name} logged in`
			})
    })

    socket.on('message', message => {
        // socket.broadcast('message', {from: socket.id, message})
        let data = {
            from: users[socket.id],
            message: message
        }
        // socket.broadcast.emit('message', data)
        ns.emit('message', data)
    })

    socket.on('disconnect', () => {
				console.log('disconnect: ', socket.id);
				delete users[socket.id]
    })
})

}

