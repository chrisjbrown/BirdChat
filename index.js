'use strict';

const app = require('./server').app;
const server = require('./server').server;

const PORT = process.env.PORT || 9000;

app.set('port', PORT);

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});