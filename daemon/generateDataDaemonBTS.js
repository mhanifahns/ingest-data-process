// Indexing active user from google play console report to ES.
const moment = require('moment');
const _ = require('lodash');
const elasticsearch = require('../config/elasticsearch');
const dataFunc = require('../helpers/data');
const esClientConn = require('../connectors/elasticsearch.conn');
const {
    createIndex,
    createMapping,
    putIndex
} = require('../helpers/elastic.helper');


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Get active user from csv file
 * @param {Date} startDate 
 * @param {Number} totalIndex 
 * @param {Array} data 
 */
async function ProcessData() {

    var dataIndex = []

    var listID= []
    // // date counter will be start same as startDate.
    // // && listLocKec.DataGeolocation[index].province_name == 'DKI JAKARTA'
    var DataProcess = await dataFunc.getData('proc',{proc:'bts'})
    var Data = await dataFunc.getDataSortAgre('bts', {}, { _id: -1 }, DataProcess[0].skip, 20000)
    var count = 0
    for (const iterator of Data) {
            if (iterator.net == 88) {
                var operator = 'bold'

            } else if (iterator.net == 8){
               var operator = 'axis'
            }
            else if (iterator.net == 28) {
                var operator = 'fren/hepi'
            }
            else if (iterator.net == 9) {
                var operator = 'smartfren'
            }
            else if (iterator.net == 89) {
                var operator = 'tri'
            }
            else if (iterator.net == 21) {
                var operator = 'im3'
            }
            else if (iterator.net == 1) {
                var operator = 'indosat'
            }
            else if (iterator.net == 11) {
                var operator = 'xl'
            }else{
                var operator = 'telkomsel'
            }
            Data[count].provider = operator
            Data[count].radio = iterator.radio.toUpperCase()
            var location = {
                "lat": Data[count].lat,
                "lon": Data[count].lon
            }
            Data[count].demography_geolocation = location
            Data[count].date = moment().toDate()
            Data[count]._id=iterator._id.toString()
            dataIndex.push(Data[count])
            listID.push(Data[count]._id)
        count++
    }
    let indexName = 'bts_demography'

    try {
        var dataClean = _.uniqBy(dataIndex,'_id')
        console.log('Delete NIK first')
        // await DeleteActiveByID(listID,indexName)
        await createIndex(esClientConn, indexName);
        console.log(`create mapping ` + indexName);
        await createMapping(esClientConn, indexName, elasticsearch.bts.mapping);
        console.log('input new data')
        await putIndex(esClientConn, indexName, dataClean);
        var query = {
            proc:'bts'
        }
        var set = {
            $set :{
                skip:DataProcess[0].skip+20000
            }
        }
        await dataFunc.updateData('proc',query,set)
    } catch (error) {
        throw error;
    }

    console.log('finish process Google Play Console data total :' + dataClean.length)
    return true;
}


ProcessData()