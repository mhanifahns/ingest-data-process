const mainCnf = require('../config/main');
const chalk = require('chalk');
const axios = require('axios').default;
/**
 * Insert data non bulk.
 * @param {Object} esClient 
 * @param {string} indexName 
 * @param {Object} data 
 */
const putIndex = async (esClient, indexName, data) => {
    let counter = 0;
  
    for (const element of data) {
      try {
        let bodyParam = {
          index: indexName,
          id: element._id,
          type: '_doc',
          refresh: true,
          body: element
        };
        delete (bodyParam.body._id);
       
        await esClient.create(bodyParam);
      } catch (error) {
        console.log(error);
        return {
          status: false,
          totalData: data.length,
          error: 'Error during inserting data in non-bulk process.'
        };
      }
      console.log(counter+'/'+data.length)
      counter++
    }
  
    // everything is ok
    // return 
    return { status: true, totalData: counter };
  }
  
  const createIndex = async (esClient, indexName) => {
    try {
      //check index exist or not
      const isIndexExist = await esClient.indices.exists({ index: indexName });
  
      // index is exist then return index name
      if (isIndexExist) return { 'index': indexName };
  
      // index not exist, then create the index.
      return await esClient.indices.create({ index: indexName });
  
    } catch (error) {
      throw error;
    }
  }
  
  const createMapping = async (esClient, indexName, mapping) => {
    try {
      return await esClient.indices.putMapping({
        index: indexName,
        body: mapping
      });
    } catch (error) {
      throw error;
    }
  
  };
  
  /**
 * Delete active user document on ES by date param. 
 * @param {Date} date 
 */

   async function DeleteActiveByNIK(nik,index) {
    const query = {
      "query": {
        "bool": {
          "filter": {
            "terms": { "NIK": nik }
          }
        }
      }
    };
   
  
    const postConfig = {
      method: 'post',
      url: `${mainCnf.services.elasticsearch.host}/${index}/_delete_by_query`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic YWRtaW5raWJhbmE6a2liYW5hUEFTUyFAIzIwMTk='
      },
      data: query
    };
  
    try {
      console.log(`delete old nik`);
      return await axios(postConfig);
    } catch (error) {
      throw error;
    }
  }

async function DeleteActiveUserByDate(date,index) {
    const query = JSON.stringify({
      "query": {
        "match": {
          "date": date
        }
      }
    });
  
    const postConfig = {
      method: 'post',
      url: `${mainCnf.services.elasticsearch.host}/${index}/_delete_by_query`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic YWRtaW5raWJhbmE6a2liYW5hUEFTUyFAIzIwMTk='
      },
      data: query
    };
  
    try {
      console.log(`delete old active user data for ${date}`);
      return await axios(postConfig);
    } catch (error) {
      throw error;
    }
  }


  async function DeleteIndexByDate(startDate,endDate,index) {
    const query = JSON.stringify({
      query: {
        range: {
          date: {
            gte:startDate,
            lte:endDate
          }
        }
      }
    });
  
    const postConfig = {
      method: 'post',
      url: `${mainCnf.services.elasticsearch.host}/${index}/_delete_by_query`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic YWRtaW5raWJhbmE6a2liYW5hUEFTUyFAIzIwMTk='
      },
      data: query
    };
  
    try {
      console.log(`delete old active user data from ${startDate} to ${endDate}`);
      return await axios(postConfig);
    } catch (error) {
      throw error;
    }
  }


  async function DeleteActiveByID(id,index) {
    const query = {
      "query": {
        "bool": {
          "filter": {
            "terms": { "_id": id }
          }
        }
      }
    };
   
  
    const postConfig = {
      method: 'post',
      url: `${mainCnf.services.elasticsearch.host}/${index}/_delete_by_query`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic YWRtaW5raWJhbmE6a2liYW5hUEFTUyFAIzIwMTk='
      },
      data: query
    };
  
    try {
      console.log(`delete old nik`);
      return await axios(postConfig);
    } catch (error) {
      throw error;
    }
  }
module.exports = {
    putIndex,
    createIndex,
    createMapping,
    DeleteActiveUserByDate,
    DeleteIndexByDate,
    DeleteActiveByID,
    DeleteActiveByNIK
  };
  