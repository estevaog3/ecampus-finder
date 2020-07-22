const { Client } = require('@elastic/elasticsearch');
const { BULK_TIMEOUT } = require('../constants');
const config = require('./searchClientConfig.json');

const client = new Client({ node: 'http://localhost:9200' });

/*  
    Author:  @ashwinaggarwal
    Elasticsearch Bulk API needs data to be in this format
    https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html
 */
const mapRecordsToElasticSearchBulk = (records, index) =>
  `${records
    .reduce(
      (mappedRecords, record) =>
        mappedRecords.concat([
          JSON.stringify({
            index: {
              _index: index,
            },
          }),
          JSON.stringify(record),
        ]),
      [],
    )
    .join('\n')}\n`;

exports.indexAll = async function indexAll(records, index) {
  try {
    await client.bulk({
      body: mapRecordsToElasticSearchBulk(records),
      index,
      timeout: BULK_TIMEOUT,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.init = async function init(index) {
  try {
    const indexExists = await client.indices.exists({ index });
    if (indexExists) {
      return;
    }

    await client.indices.create({
      index,
      body: JSON.parse(config),
    });
  } catch (e) {
    console.log('searchClient init: failed to init:', e);
    process.exit(1);
  }
};
