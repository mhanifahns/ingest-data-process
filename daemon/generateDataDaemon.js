// Indexing active user from google play console report to ES.
const phoneid = require('phone-id.js')
const listLocKec = require('../config/list_location_kec')
const listProvider = require('../config/list_provider')
const moment = require('moment');
const _ = require('lodash');
const elasticsearch = require('../config/elasticsearch');
const dataFunc = require('../helpers/data');
const esClientConn = require('../connectors/elasticsearch.conn');
const {
    createIndex,
    createMapping,
    putIndex,
    DeleteActiveByNIK,
} = require('../helpers/elastic.helper');

function generateProvider() {
    var provider = listProvider.provider[getRandomInt(0, listProvider.provider.length)]

    return provider;


}

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
    var listNIK= []
    // date counter will be start same as startDate.
    // && listLocKec.DataGeolocation[index].province_name == 'DKI JAKARTA'
    var DataProcess = await dataFunc.getData('proc',{proc:'nik'})
    var Data = await dataFunc.getDataSortAgre('nik-sample', {}, { _id: -1 }, DataProcess[0].skip, 9000)
    var count = 0
    for (const iterator of Data) {
        var index = _.findIndex(listLocKec.DataGeolocation, { kecamatan_name: iterator.NAMA_KEC });
        if (index != -1 ) {
            var provider = await generateProvider()
            if (provider == 'xl') {
                var number = await phoneid.xl(8, false)

            } else if (provider == 'three') {
                var number = await phoneid.three(8, false)
            }
            else if (provider == 'telkomsel') {
                var number = await phoneid.telkomsel(8, false)
            }
            else if (provider == 'smartfren') {
                var number = await phoneid.smartfren(8, false)
            }
            else if (provider == 'indosat') {
                var number = await phoneid.indosat(8, false)
            }
            else if (provider == 'axis') {
                var number = await phoneid.axis(8, false)
            }
            Data[count].PHONE_NUMBER = number
            Data[count].CLEAN = true
            Data[count].JENIS_KLMIN = iterator.JENIS_KLMIN.toUpperCase()
            Data[count].PROVIDER = provider
            var location = {
                "lat": listLocKec.DataGeolocation[index].lat,
                "lon": listLocKec.DataGeolocation[index].lng
            }
            Data[count].DEMOGRAPHY_GEOLOCATION = location
            Data[count].DATE = moment().toDate()
            if (typeof iterator.TGL_LHR != 'undefined' && iterator.TGL_LHR != null && iterator.TGL_LHR != '') {
                Data[count].TGL_LHR = moment(iterator.TGL_LHR).toDate()
            }
            var query = {
                _id:iterator._id
            }
            var set = {
                $set:{
                    PHONE_NUMBER:number,
                    track:1
                }
            }
            Data[count]._id = iterator._id.toString()
            dataIndex.push(Data[count])
            listNIK.push(Data[count].NIK)
            
            await dataFunc.updateData('nik-sample',query,set)
        }
        count++
    }
    let indexName = 'people_demography'

    try {
        var dataClean = _.uniqBy(dataIndex,'NIK')
        console.log('Delete NIK first')
        await DeleteActiveByNIK(listNIK,indexName)
        await createIndex(esClientConn, indexName);
        console.log(`create mapping ` + indexName);
        await createMapping(esClientConn, indexName, elasticsearch.ktp.mapping);
        console.log('input new data')
        await putIndex(esClientConn, indexName, dataClean);
        var query = {
            proc:'nik'
        }
        var set = {
            $set :{
                skip:DataProcess[0].skip+9000
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