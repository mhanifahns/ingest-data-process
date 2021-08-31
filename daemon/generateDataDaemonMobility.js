
const _ = require('lodash');
const elasticsearch = require('../config/elasticsearch');
const dataFunc = require('../helpers/data');
const esClientConn = require('../connectors/elasticsearch.conn');
const {
    createIndex,
    createMapping,
    putIndex,
} = require('../helpers/elastic.helper');


/**
 * Get active user from csv file
 * @param {Date} startDate 
 * @param {Number} totalIndex 
 * @param {Array} data 
 */
async function ProcessData() {

    var dataIndex = []

    var listID = []
    // // date counter will be start same as startDate.
    // // && listLocKec.DataGeolocation[index].province_name == 'DKI JAKARTA'

    var Data = await dataFunc.getDataSortAgre('mobility', {}, { _id: -1 }, 0, 30000)
    var count = 0
    for (const iterator of Data) {
            Data[count]._id = iterator._id.toString()
            dataIndex.push(Data[count])
        count++
    }
    let indexName = 'indonesian_mobility'
    try {
        var dataClean = _.uniqBy(dataIndex, '_id')
        console.log('Delete NIK first')
      
        // await DeleteActiveByID(listID,indexName)
        await createIndex(esClientConn, indexName);
        console.log(`create mapping ` + indexName);
        await createMapping(esClientConn, indexName, elasticsearch.mobility.mapping);
        console.log('input new data')
        await putIndex(esClientConn, indexName, dataClean);
    } catch (error) {
        throw error;
    }

    console.log('finish process Google Play Console data total :' + dataClean.length)
    return true;
}


ProcessData()