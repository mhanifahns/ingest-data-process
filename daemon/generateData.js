
const database = require('../config/database');
const dataFunc = require('../helpers/data');
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: database.mysql.host,
        user: database.mysql.user,
        password: database.mysql.password,
        database: database.mysql.database
    }
});
const moment = require('moment')

/**
 * Get active user from csv file
 * @param {Date} startDate 
 * @param {Number} totalIndex 
 * @param {Array} data 
 */
async function ProcessData() {

    // date counter will be start same as startDate.
    // && listLocKec.DataGeolocation[index].province_name == 'DKI JAKARTA'
    
    var dataKTP =[]
    var Process = await dataFunc.getDataSortAgre('proc',{proc:'ktp'})
    var Data = await dataFunc.getDataSortAgre('nik-sample', {}, { _id: -1 }, Process[0].skip, 9000)
    for (const iterator of Data) {
        var data ={
            Nama:iterator.NAMA_LGKP,
            NIK:iterator.NIK.replace('EKTP_',''),
            Foto_KTP:null,
            Tempat_Lahir:iterator.TMPT_LHR,
            Tanggal_Lahir:moment(iterator.TGL_LHR,'DD-MM-YYYY').toDate(),
            Jenis_Kelamin:iterator.JENIS_KLMIN,
            Alamat:iterator.ALAMAT,
            Gol_Darah:iterator.GOL_DARAH,
            Agama:iterator.AGAMA,
            Kewarganegaraan:'WNI',
            Client_Key:'2da3c6256237e6aa70b9d42e953176c51628135286261',
            Kabupaten:iterator.NAMA_KAB,
            Kecamatan:iterator.NAMA_KEC,
            Kelurahan:iterator.NAMA_KEL,
            Provinsi:iterator.NAMA_PROP,
            Nama_Lengkap_Ayah:iterator.NAMA_LGKP_AYAH,
            Nama_Lengkap_Ibu:iterator.NAMA_LGKP_IBU,
            Kode_Pos:iterator.KODE_POS.toString(),
            Dusun:iterator.DUSUN,
            Pekerjaan:iterator.PEKERJAAN,
            No_KK:iterator.NO_KK.toString(),
            RT:iterator.NO_RT.toString(),
            RW:iterator.NO_RW.toString(),
            Created_At:moment().toDate(),
            Enroll_Status:"Done"
        }
        await knex('aph_personal_data').insert(data)
    }
    var updateSkip = Process[0].skip+9000
    var query = {
        proc:'ktp'
    }
    var set = {
        $set:{
            skip:updateSkip
        }
    }
    await dataFunc.updateData('proc',query,set)
    console.log('Done')
    try {

    } catch (error) {
        throw error;
    }
    return true;
}



ProcessData().then(result => {
    process.exit();
  }).catch(err => {
    logger.error('Something went wrong during data sync.');
    console.error(err);
    process.exit();
  });