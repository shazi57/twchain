const Block = require('./models/block');
const db = require('./db');

let started = false;

const mine = () => {
  if (!started) return;

  const newBlock = new Block();

  db.blockchain.addBlock(newBlock);

  console.log('mined a new block');

  setTimeout(mine, 2000);
};

const startMining = () => {
  started = true;
  mine();
};

const stopMining = () => {
  started = false;
};
module.exports = {
  mine,
  startMining,
  stopMining,
};
