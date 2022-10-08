const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const OpenApiValidator = require("express-openapi-validator");

const routes = require("./routes");

const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(
  OpenApiValidator.middleware({
    apiSpec: "./api.yaml",
  }),
);

app.use("/", routes);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

module.exports = app;
