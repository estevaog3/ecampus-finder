const searchClient = require("../services/searchClient");

module.exports.search = async function (req, res) {
  const { query, limit, offset, sort } = req.query;
  const { filter } = req.body;

  const hits = await searchClient.query(
    process.env.INDEX,
    query,
    limit,
    offset,
    sort,
    filter,
  );
  if (!hits) {
    res.status(500).send({ message: "Search failed" });
    return;
  }
  res.json(
    hits.map((hit) => {
      return {
        curso: hit._source.curso,
        disciplina: hit._source.disciplina,
        codigo: hit._source.codigo,
        concorrencia: hit._source.concorrencia,
        horarios: hit._source.horarios,
      };
    }),
  );
}