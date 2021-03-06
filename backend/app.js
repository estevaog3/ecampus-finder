const express = require("express");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");

const { OpenApiValidator } = require("express-openapi-validator");

const routes = require("./routes");

const apiSpec = path.join(__dirname, "api.yaml");

const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());

new OpenApiValidator({
  apiSpec,
})
  .install(app)
  .then(() => {
    app.use("/v1/", routes);

    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      res.status(err.status || 500).json({
        message: err.message,
      });
    });
  })
  .catch((e) => console.log(e.message));

module.exports = app;
