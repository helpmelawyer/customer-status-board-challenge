/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express');

// Setup server
const app = express();
const server = require('http').createServer(app);
require('./express')(app);

// Start server
const ip = '0.0.0.0';
const port = process.env.PORT || 3000;
server.listen(port, ip, function () {
  console.log('Express server listening on %d, in %s mode', port, app.get('env'));
});

// Expose app
exports = module.exports = app;
