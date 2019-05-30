const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log("we are live");
});
app.use("/", express.static("public"));

