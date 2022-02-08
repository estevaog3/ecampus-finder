const express = require("express");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");

const OpenApiValidator = require('express-openapi-validator');

const routes = require("./routes");

const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(OpenApiValidator.middleware({
  apiSpec: './api.yaml'
}))

app.use("/v1/", routes);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

module.exports = app;
