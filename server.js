const express = require("express");
const app = express();
var port = 3000;

var five = require("johnny-five");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
const colors = ['00FF00', 'FFF714', 'FF0000', '0000FF', 'FF00FB', '42F4E8', 'f442e2', 'ffff07']

// const beatData = require("./public/script")

app.listen(port, () => {
  console.log("we are live");
});
app.use("/", express.static("public"));

five.Board().on("ready", function() {
  var led1 = new five.Led.RGB({
    pins: {
      red: 9,
      green: 6,
      blue: 5
    }
  });

  var led2 = new five.Led.RGB({
    pins: {
      red: 3,
      green: 10,
      blue: 11
    }
  });
  led1.on();
  led1.color("#00FF00");

  led2.on();
  led2.color("#0000FF");


  //-----NOTE if i leave music page the lights stop blinking
  wss.on("connection", function(ws, req) {
    ws.on("message", function(data) {
      // led.color("#" + data);
      // console.log(data)
      // console.log('connected')
      if (data === 'dance') {
        led1.color(colors[Math.floor(Math.random()*colors.length)])
        led1.strobe(700);
      }
    });
  });
});