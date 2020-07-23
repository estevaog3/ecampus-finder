const express = require('express');
const searchClient = require('./services/searchClient');
const { PROD_INDEX } = require('./constants');

const router = express.Router();

const transformQuery = (query) => {
  return query
    .replace(/( e )|( E )/g, ' AND ')
    .replace(/( ou )|( OU )|( Ou )|( oU )/g, ' OR ');
};

router.post('/search', async (req, res) => {
  const { query, limit, offset, sort } = req.query;
  const { filter } = req.body;
  const hits = await searchClient.query(
    PROD_INDEX,
    transformQuery(query),
    limit,
    offset,
    sort,
    filter,
  );
  if (!hits) {
    res.status(500).send({ code: 500, message: 'Search failed' });
    return;
  }
  res.json(hits);
});

module.exports = router;
