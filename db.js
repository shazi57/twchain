const Blockchain = require('./models/blockchain');

const db = {
  blockchain: new Blockchain(),
};

module.exports = db;
