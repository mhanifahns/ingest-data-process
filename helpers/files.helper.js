const cmd = require('shelljs');
const fs = require('fs');
const mainConf= require('../config/main');
const targetFolder = mainConf.targetFolder;
const bucket = mainConf.bucket;
const createFolder = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  return path;
};

/**
 * Get file from google cloud storage
 * @param {String} file 
 */
const getFile = async (file) => {
  createFolder(targetFolder);
  return cmd.exec('gsutil cp gs://' + bucket + file + ' ' + targetFolder);
}

module.exports= {
  getFile
};
