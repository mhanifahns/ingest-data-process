const es = require('elasticsearch');
const esConfig = require('../config/main').services.elasticsearch;

console.log(`Connecting to ${esConfig.host}`)
module.exports=  new es.Client(esConfig);
