const mongoose = require('mongoose');
const dbConfig = require('../config/database')[0];
const dbURL = 'mongodb://' + dbConfig.connection.host + '/' + dbConfig.connection.database

const con = mongoose.createConnection(dbURL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });


if (con) {
  console.log('Mongoose connected to', dbConfig.connection.database)
}

mongoose.connection.on('connected', () => {
  console.log(connected('Mongoose connected to ', dbURL))
})

mongoose.connection.on('error', function (err) {
  console.log(error('Mongoose default connection has occured ' + err + ' error'))
})

mongoose.connection.on('disconnected', function () {
  console.log(disconnected('Mongoose default connection is disconnected'))
})

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection is disconnected due to application termination')
    process.exit(0)
  })
})

module.exports = con;
