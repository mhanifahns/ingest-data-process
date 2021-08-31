// Indexing active user from google play console report to ES.
const fastCSV = require('fast-csv');
const randomName = require('random-pick-name')
const fs = require('fs');
const phoneid = require('phone-id.js')
const listLoc = require('../config/list_location')
const listLocJawa = require('../config/list_location_jawa')
const listLocJakarta = require('../config/list_location_jakarta')
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
    DeleteIndexByDate
} = require('../helpers/elastic.helper');
const { DataGeolocation } = require('../config/list_location');
const { uniqBy } = require('lodash');

function generateProvider() {
    var provider = listProvider.provider[getRandomInt(0, listProvider.provider.length)]

    return provider;


}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateGeolocationKecamatan() {
    var randomIndex = getRandomInt(0, listLocKec.DataGeolocation.length + 1)

    var location = {
        "lat": listLocKec.DataGeolocation[randomIndex].lat,
        "lon": listLocKec.DataGeolocation[randomIndex].lng
    }
    return location
}

function generateGeolocation() {
    var randomIndex = getRandomInt(0, listLoc.DataGeolocation.length + 1)

    var location = {
        "lat": listLoc.DataGeolocation[randomIndex].lat,
        "lon": listLoc.DataGeolocation[randomIndex].long
    }
    return location
}

function generateGeolocationJakarta() {
    var randomIndex = getRandomInt(0, listLocJakarta.DataGeolocation.length + 1)
    var location = {
        "lat": listLocJakarta.DataGeolocation[randomIndex].lat,
        "lon": listLocJakarta.DataGeolocation[randomIndex].long
    }
    return location
}

async function generateGeolocationJawa() {
    var randomIndex = await getRandomInt(0, listLocJawa.DataGeolocation.length + 1)
    var location = {
        "lat": listLocJawa.DataGeolocation[randomIndex].lat,
        "lon": listLocJawa.DataGeolocation[randomIndex].long
    }
    if (typeof listLocJawa.DataGeolocation[randomIndex].lat == 'undefined') {

        console.log(listLocJawa.DataGeolocation[randomIndex].kabko)
    }
    console.log(listLocJawa.DataGeolocation[randomIndex])
    return location
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

    var Data = await dataFunc.getDataSortAgre('nik-sample', {}, { _id: -1 }, 88000, 9000)
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
    } catch (error) {
        throw error;
    }

    console.log('finish process Google Play Console data total :' + dataClean.length)
    return true;
}


ProcessData()