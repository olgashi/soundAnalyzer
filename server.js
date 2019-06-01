const express = require("express");
const app = express();
var port = 3000;

var five = require("johnny-five");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

// const beatData = require("./public/script")

app.listen(port, () => {
  console.log("we are live");
});
app.use("/", express.static("public"));

five.Board().on("ready", function() {
  var led = new five.Led.RGB({
    pins: {
      red: 9,
      green: 6,
      blue: 5
    }
  });
  led.on();
  led.color("#00FF00");
  wss.on("connection", function(ws, req) {
    ws.on("message", function(data) {
      led.color("#" + data);
      // console.log(data)
      // console.log('connected')
    });
  });
});