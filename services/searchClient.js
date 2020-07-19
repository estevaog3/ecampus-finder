const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });

exports.indexAll = async function indexAll(records) {
  console.log(process.env.INDEX);
  try {
    await Promise.all(
      records.map((record) =>
        client.index({
          index: 'turmas', // TODO: remove this hardcoded value
          body: record,
        }),
      ),
    );
  } catch (e) {
    console.log(e.message);
  }
};
