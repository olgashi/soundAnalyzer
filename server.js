const express = require("express");
const app = express();
var port = 3000;

var five = require("johnny-five");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
var colors = ["FF0000", "FF7F00", "FFFF00", "00FF00", "0000FF", "4B0082", "8F00FF"];

//NOTE clear lights once the board is off???
app.listen(port, () => {
  console.log(`Server is live on port ${port}`);
});
app.use("/", express.static("public"));

five.Board().on("ready", function() {
  var led1 = new five.Led.RGB({
    pins: {
      red: 11,
      green: 10,
      blue: 9
    }
  });

  var led2 = new five.Led.RGB({
    pins: {
      red: 6,
      green: 5,
      blue: 3
    }
  });
  led1.on();
  led1.color("#00FF00");

  led2.on();
  led2.color("purple");

  wss.on("connection", function(ws, req) {
    ws.on("message", function(color) {
      let rgbColors = color.split(',')
      led1.color(rgbColors[0])
      // led2.color(rgbColors[1])
      led2.toggle()
    })
  })})
