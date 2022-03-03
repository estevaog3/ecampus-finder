const { Client } = require("@elastic/elasticsearch");
const { BULK_TIMEOUT, SEARCH_TIMEOUT } = require("../constants");
const config = require("./searchClientConfig.json");

const client = new Client({ node: "http://localhost:9200" });

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
    .join("\n")}\n`;

const getDaysOfWeekExcluding = (days) => {
  let daysOfWeek = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  return daysOfWeek.filter(dayToKeep => days.every(dayToExclude => dayToKeep !== dayToExclude));
}

exports.indexAll = async function indexAll(records, index) {
  try {
    await client.bulk({
      body: mapRecordsToElasticSearchBulk(records, index),
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
    if (indexExists.body === true) {
      return;
    }

    await client.indices.create({
      index,
      body: config,
    });
  } catch (e) {
    console.log("searchClient init: failed to init:", e);
    process.exit(1);
  }
};

exports.query = async function query(
  index,
  queryString,
  limit,
  offset,
  sort,
  filter,
) {
  try {
    const { body } = await client.search({
      index,
      size: limit,
      from: offset,
      timeout: SEARCH_TIMEOUT,
      sort,
      body: {
        query: {
          bool: {
            must:
            {
              multi_match: {
                query: queryString,
                fuzziness: "AUTO"
              }
            },
            filter: [
              {
                range: {
                  inicioTimestamp: { gte: filter.startTimestampMin }
                }
              }, 
              {
                range: {
                  terminoTimestamp: { lte: filter.endTimestampMin }
                }
              }
            ],
            must_not: [
              {
                terms: {
                  "horarios.dias": getDaysOfWeekExcluding(filter.days)
                }
              }
            ]
          }
        }
      }
    });
    return body.hits.hits;
  } catch (e) {
    console.log("searchClient query failed:");
    if(e.body && e.body.error) {
      console.log(e.body.error);
    }else {
      console.log(e.message);
    }
    return undefined;
  }
};
