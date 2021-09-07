
const database = require('../config/database');
const phoneid = require('phone-id.js')
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

async function ProcessData() {
  var getPersonalData = await knex('aph_personal_data').select('Personal_Data_ID').whereRaw('is_delete=0 AND Client_Key ="2da3c6256237e6aa70b9d42e953176c51628135286261"')
  var count = 0
  for (const iterator of getPersonalData) {
    var rand = Math.floor(Math.random() * 7) + 1;
    if (rand == 1) {
      var number = await phoneid.xl(8, false)

    } else if (rand == 2) {
      var number = await phoneid.three(8, false)
    }
    else if (rand == 3) {
      var number = await phoneid.telkomsel(8, false)
    }
    else if (rand == 4) {
      var number = await phoneid.smartfren(8, false)
    }
    else if (rand == 5) {
      var number = await phoneid.indosat(8, false)
    }
    else {
      var number = await phoneid.axis(8, false)
    }
    var data = {
      Personal_ID: iterator.Personal_Data_ID,
      MobilePhoneNumber: number,
      is_delete: 0,
      Created_At: moment().toDate()
    }
    await knex('aph_mobilephone_data').insert(data)
    console.log('process '+count+'/'+getPersonalData.length)
    count++
  }
}


ProcessData().then(result => {
  process.exit();
}).catch(err => {

  console.error(err);
  process.exit();
});