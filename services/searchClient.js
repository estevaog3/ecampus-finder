const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });

exports.indexAll = async function indexAll(records, index) {
  try {
    await Promise.all(
      records.map((record) =>
        client.index({
          index,
          body: record,
        }),
      ),
    );
  } catch (e) {
    console.log(e.message);
  }
};
