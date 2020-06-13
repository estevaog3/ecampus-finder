var express = require("express");
var logger = require("morgan");

var routes = require("./routes");

var app = express();

app.use(logger("dev"));
app.use("/", routes);

module.exports = app;
