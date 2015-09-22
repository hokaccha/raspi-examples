var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var pin = process.argv[2];
var app = express();
var gpioDir = '/sys/class/gpio/gpio' + pin;

app.use(bodyParser.urlencoded({ extended: false }));

if (!fs.existsSync(gpioDir)) {
  fs.writeFileSync('/sys/class/gpio/export', pin);
  fs.writeFileSync(gpioDir + '/direction', 'out');
}

function getValue() {
  var val = fs.readFileSync(gpioDir + '/value').trim();
  return val === '0' ? 'off' : 'on';
}

function setValue(value) {
  var val = value === 'off' ? '0' : '1';
  fs.writeFileSync(gpioDir + '/value', val);
}

app.get('/led', function(req, res) {
  res.send({ status: getValue() });
});

app.post('/led', function(req, res) {
  setValue(req.body.status);
  res.send(200);
});

app.listen(4567);
