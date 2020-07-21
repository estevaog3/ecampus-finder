const express = require('express');

const router = express.Router();

router.post('/search', (req, res, next) => {
  console.log('params:', req.query);
  res.json([{ res: 'Hello world' }]);
});

module.exports = router;
