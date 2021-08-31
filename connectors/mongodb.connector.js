const dbConfig = require('../config/database');
const MongoClient = require('mongodb').MongoClient;

/**
 * init database connection using dbConfig.
 */
class MongoConnector {
  constructor() {
    this.dbConfig = null;
    this.Client = null;
  }

  /**
   * 
   * @param {Number} connectionNumber 
   */
  async connect(connectionNumber = 0) {

    // set connection number
    this.dbConfig = dbConfig[connectionNumber];
    console.log(`connecting to ${this.dbConfig.dbName} database...`);

    try {
      this.Client = new MongoClient(this.dbConfig.url,
        {
          useUnifiedTopology: true,
          useNewUrlParser: true
        });
      await this.Client.connect();
      const db = this.Client.db(this.dbConfig.dbName);
      console.log('connected');
      return db;
    } catch (error) {
      throw error;
    }
  }

  /**
   * close db connection
   */
  async disconnect() {
    this.Client.close();
  }
}

const Connector = new MongoConnector();
module.exports = Connector;