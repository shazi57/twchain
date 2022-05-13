const EC = require('elliptic').ec;
const db = require('./db');
const Miner = require('./models/miner');

const ec = new EC('secp256k1');

const { NUM_MINERS } = process.env;

const generateMiners = () => {
  const miners = [];
  for (let i = 0; i < NUM_MINERS; i += 1) {
    const key = ec.genKeyPair();
    const publicKey = key.getPublic().encode('hex');

    const newMiner = new Miner(publicKey);
    miners.push(newMiner);
    console.log(`Miner ${i}'s address is ${newMiner.getAddress()}`);
    db.push('/nodes', miners);
  }
};

module.exports = generateMiners;
