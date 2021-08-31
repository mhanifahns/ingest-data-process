var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

async function connectionMongo(fastify, options) {
    try {
        const db = await MongoClient.connect(url, {useUnifiedTopology: true, useNewUrlParser: true, }).catch(err => {
            console.log(err);
            console.log('Database error');
        });
        return db;
    } catch (err) {
        console.log(err);
        console.log('Database error 2');
    }
}

module.exports.connectionMongo = connectionMongo;