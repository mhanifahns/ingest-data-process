const mainCnf = require('../config/main').services.es_client;
const uri = mainCnf.url;
const axios = require('axios').default;

const esClient = {
  Indexing: async (reportType, startDate = null, endDate = null) => {
    console.log(`Starting indexing ${reportType}`);
    // send post request
    const result = await axios.post(uri,
      {
        start_date: startDate,
        end_date: endDate,
        report_type: reportType
      },
      {
        headers: {
          "Content-Type": "application/json",
          "responseType": "json"
        }
      }
    );
    return result.data;
  }
};


const createMapping = async (esClient, indexName, mapping) => {
  return await esClient.indices.putMapping({
    index: indexName,
    body: mapping
  });
};

const createIndex = async (esClient, indexName) => {

  //check index exist or not
  const indexInfo = await esClient.indices.exists({
    index: indexName
  });

  // index not exist and create index
  if (indexInfo) {
    return { 'index': indexName };
  } else {
    return await esClient.indices.create({
      index: indexName
    });
  }
}

/**
 * PUT index on elastic
 * @param {Object} esClient 
 * @param {String} indexName 
 * @param {Object} data 
 */
const putIndex = async (esClient, indexName, data) => {
  const offset = 1000;
  const totalData = data.length;
  let dataSet = [];

  for (let i = 0; i < totalData; i++) {
    const element = data[i];
    dataSet.push({
      index: {
        _index: indexName,
        _id: element._id
      }
    });
    delete (element._id);
    dataSet.push(element);
    if ((i + 1) % offset === 0) {
      if (i > 0) {
        const bulkProcess = await esClient.bulk({ body: dataSet });
        if (bulkProcess.errors) {
          return { totalData: totalData, error: bulkProcess.errors }
        }
        dataSet = [];
      }
    } else if (i + 1 === totalData) {
      const bulkProcess = await esClient.bulk({ body: dataSet });
      if (bulkProcess.errors) {
        return { totalData: totalData, error: bulkProcess.errors }
      }
      dataSet = [];
    }
  }

  return { totalData: totalData };
}

/**
 * Delete index by indexName param.
 * @param {Object} esClient 
 * @param {String} indexName 
 */
const deleteIndex = async (esClient, indexName) => {
  return await esClient.indices.delete({
    index: indexName
  });
}

module.exports = {
  esClient,
  createIndex,
  createMapping,
  putIndex,
  deleteIndex
};
