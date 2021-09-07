
const _ = require('lodash');
const elasticsearch = require('../config/elasticsearch');
const dataFunc = require('../helpers/data');
const esClientConn = require('../connectors/elasticsearch.conn');
const moment = require('moment');
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
    var Data = await dataFunc.getDataSortAgre('internal-data', {}, { _id: -1 }, 0, 30000)
    var count = 0
    for (const iterator of Data) {
            Data[count]._id = iterator._id.toString()
            Data[count].DOC_NUM = iterator.DOC_NUM.toString()
            Data[count].DOC_DATE = moment(iterator.DOC_DATE,'MM/DD/YYYY').toDate()
            Data[count].CODE = iterator.CODE.toString()
            Data[count].CUSTOMER = iterator.CUSTOMER.toString()
            Data[count].PROVINSI = iterator.PROVINSI.toString()
            var dataGeo = await dataFunc.getData('geo_location',{province_name:iterator.PROVINSI.toString()})
           
            var location = {
                "lat": dataGeo[0].lat,
                "lon": dataGeo[0].lng
            }
            Data[count].PROVINSI_GEO = location
            Data[count].PRICE = parseInt(iterator.PRICE.replace(/,/g, ''));
            Data[count].TOTAL_AMOUNT = parseInt(iterator.TOTAL_AMOUNT.replace(/,/g, ''));
            dataIndex.push(Data[count])
        count++
    }
    let indexName = 'internal_data_pt_omi_2020'
    try {
        var dataClean = _.uniqBy(dataIndex, '_id')
        console.log('Delete NIK first')
        console.log(Data)
        // await DeleteActiveByID(listID,indexName)
        await createIndex(esClientConn, indexName);
        console.log(`create mapping ` + indexName);
        await createMapping(esClientConn, indexName, elasticsearch.internal_data_onda.mapping);
        console.log('input new data')
        await putIndex(esClientConn, indexName, dataClean);
    } catch (error) {
        throw error;
    }

    console.log('finish process Google Play Console data total :' + dataClean.length)
    return true;
}


ProcessData()