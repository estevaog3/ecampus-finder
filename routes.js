var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/search", function (req, res, next) {
  console.log('params:', req.query);
  res.json([{res: "Hello world"}]);
});

module.exports = router;
