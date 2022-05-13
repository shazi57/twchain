const Block = require('./models/block');
const UTXO = require('./models/utxo');
const Transaction = require('./models/transaction');
const db = require('./db');

const TARGET_DIFFICULTY = BigInt(`0x0${('F').repeat(63)}`);
const BLOCK_SPACE = 2000;
const { NUM_MINERS } = process.env;
const COINBASE_REWARDS = 6;

let knob = true;

const startMining = () => {
  knob = true;
  mine();
};

const stopMining = () => {
  knob = false;
};

const mine = (options = 'auto') => {
  if (!knob) {
    return;
  }
  // Select random miner from db
  const minerIndex = Math.floor(Math.random() * NUM_MINERS);
  const blockNumber = db.getData('/blocks').length;
  const miner = db.getData('/nodes')[minerIndex];
  const newBlock = new Block();

  const outputUtxo = new UTXO(miner.address, COINBASE_REWARDS);
  const transaction = new Transaction([], [outputUtxo], blockNumber);

  // iterate mempool
  // include transaction
  newBlock.addTransaction(transaction);
  newBlock.execute();

  let space = transaction.size;
  const mempool = db.getData('/mempool');
  while (space < BLOCK_SPACE && mempool.length > 0) {
    const tx = mempool.shift();
    const newTx = new Transaction(tx.inputs, tx.outputs, blockNumber);
    newBlock.addTransaction(newTx);
    space += tx.size;
  }

  while (BigInt(`0x${newBlock.getHash()}`) >= TARGET_DIFFICULTY) {
    newBlock.nonce += 1;
  }

  // Set merkle root

  newBlock.setMerkleRoot();

  console.log(`miner ${minerIndex} mined a new block with nonce ${newBlock.nonce} and hash ${newBlock.getHash()}`);

  Object.assign(newBlock, { hash: newBlock.getHash() });
  db.push('/mempool', mempool);
  db.push('/blocks[]', newBlock);
  const unspentUTXOs = db.getData('/utxos').filter((utxo) => !utxo.spent);
  db.push('/utxos', unspentUTXOs);
  if (options === 'auto') {
    setTimeout(mine, 5000);
  }
};

module.exports = {
  mine,
  startMining,
  stopMining,
};
