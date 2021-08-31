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
    DeleteActiveByID,
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

    var listID = []
    // // date counter will be start same as startDate.
    // // && listLocKec.DataGeolocation[index].province_name == 'DKI JAKARTA'

    var Data = await dataFunc.getDataSortAgre('region_mobility', {}, { _id: -1 }, 0, 30000)
    var count = 0
    for (const iterator of Data) {
        Data[count].country_region = iterator.country_region.toUpperCase()
        if (iterator.sub_region_1 != "") {
            Data[count].sub_region_1 = iterator.sub_region_1.toUpperCase()
        }
        if (iterator.sub_region_2 != "") {
            Data[count].sub_region_2 = iterator.sub_region_2.toUpperCase()
        }
        if (iterator.metro_area != "") {
            Data[count].metro_area = iterator.metro_area.toUpperCase()
        }
        Data[count]._id = iterator._id.toString()
        dataIndex.push(Data[count])
        
        count++
    }
    let indexName = 'id_region_mobility_report'

    try {
        var dataClean = _.uniqBy(dataIndex, '_id')
        console.log('Delete NIK first')

        // await DeleteActiveByID(listID,indexName)
        await createIndex(esClientConn, indexName);
        console.log(`create mapping ` + indexName);
        await createMapping(esClientConn, indexName, elasticsearch.ID_Region_Mobility_Report.mapping);
        console.log('input new data')
        await putIndex(esClientConn, indexName, dataClean);
    } catch (error) {
        throw error;
    }

    console.log('finish process Google Play Console data total :' + dataClean.length)
    return true;
}

ProcessData()