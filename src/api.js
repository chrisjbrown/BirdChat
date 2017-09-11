import io from 'socket.io-client';
const socket = io();

export function sendMessage(message, cb) {
  console.log('emitting SEND...');
  socket.emit('SEND', message);
}

export function subscribeToMessages(cb) {
  socket.on('MESSAGE_RECEIVED', message => {
    message.createdDatetime = new Date();
    cb(null, message)
  });

  // TODO: choose better method of handling errors
  socket.on('SEND_FAILURE', (err, message) => {
    console.error(err);
    message = {
      body: 'X Error sending message',
      createdDatetime: new Date(),
      originator: process.env.REACT_APP_VMN
    };
    cb(null, message);
  })
}