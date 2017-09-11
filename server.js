const morgan = require('morgan');

const express = require('express');
const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const messagebird = require('messagebird')('Y7qf7MD9XCkeeFrravPSPHsk6');

const path = require('path');
const fs = require('fs');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, 'build')));

// Listen for socket connection
io.on('connection', (socket) => {
  socket.on('SEND', (message) => {
    messagebird.messages.create(message, (err, response) => {
      if (err) {
        return socket.emit('SEND_FAILURE', err, message);
      }
      socket.emit('MESSAGE_RECEIVED', response);
    });
  });
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

// accept incoming messages and signal client
app.post('/incoming', (req, res) => {
  io.sockets.emit('MESSAGE_RECEIVED', req.body);
  res.send('ok');
  return;
});

module.exports = {app: app, server: server};