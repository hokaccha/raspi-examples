var fs = require('fs');
var express = require('express');
var pin = process.argv[2];
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gpioDir = '/sys/class/gpio/gpio' + pin;

app.use(express.static('public'));

if (!fs.existsSync(gpioDir)) {
  fs.writeFileSync('/sys/class/gpio/export', pin);
  fs.writeFileSync(gpioDir + '/direction', 'out');
}

function getValue() {
  var val = fs.readFileSync(gpioDir + '/value').toString().trim();
  return val === '0' ? 'off' : 'on';
}

io.on('connection', function(socket){
  setInterval(function() {
    socket.emit(getValue());
  }, 1000);
});

http.listen(4567, function() {
  console.log('listen to: http://localhost:' + this.address().port);
});
