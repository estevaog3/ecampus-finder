const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/search', (req, res, next) => {
  console.log('params:', req.query);
  res.json([{ res: 'Hello world' }]);
});

module.exports = router;
