var express = require("express");
var logger = require("morgan");
const path = require("path");
const { OpenApiValidator } = require('express-openapi-validator');

var routes = require("./routes");
const apiSpec = path.join(__dirname, 'api.yaml');
console.log(apiSpec);

var app = express();
app.use(logger("dev"));

new OpenApiValidator({
  apiSpec: apiSpec,
})
  .install(app)
  .then(() => {
    
    app.use("/v1/", routes);

    app.use((err, req, res, next) => {
      res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
      });
    });
  })
  .catch(e => console.log(e.message));

module.exports = app;
