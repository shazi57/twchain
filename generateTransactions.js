const db = require('./db');
const Transaction = require('./models/transaction');
const UTXO = require('./models/utxo');

let knob = true;

const startGenerating = () => {
  knob = true;
  generateTransactions();
};

const stopGenerating = () => {
  knob = false;
};

const generateTransactions = () => {
  if (!knob) {
    return;
  }
  const miners = db.getData('/nodes');
  const senderIndex = Math.floor(Math.random() * miners.length);
  const recipientIndex = Math.floor(Math.random() * miners.length);
  const randomSender = miners[senderIndex];
  const randomRecipient = miners[recipientIndex];

  const senderUtxos = db.getData('/utxos')
    .filter((tx) => !tx.spent && tx.owner === randomSender.address);
  const senderBalance = senderUtxos.reduce((p, utx) => p + utx.amount, 0);
  // get sender's balance
  if (senderBalance === 0 || randomSender.address === randomRecipient.address) {
    generateTransactions();
    return;
  }
  // choose random amount to send from sender to recipient

  const randomAmountToSend = Math.random() * senderBalance * 0.9;
  // grab utxos until it exceeds random amount to send
  let sumUtxo = 0;
  let index = 0;
  const inputUtxos = [];
  while (randomAmountToSend > sumUtxo) {
    sumUtxo += senderUtxos[index].amount;
    inputUtxos.push(senderUtxos[index]);
    index += 1;
  }

  const resUtxos = inputUtxos.map((utxo) => new UTXO(utxo.owner, utxo.amount));
  const outputUtxo1 = new UTXO(randomRecipient.address, randomAmountToSend);
  const outputUtxo2 = new UTXO(randomSender.address, sumUtxo - randomAmountToSend);
  const tx = new Transaction(resUtxos, [outputUtxo1, outputUtxo2]);

  tx.execute();
  db.push('/mempool[]', tx);

  // create a transaction with random utxos as an input,
  // sum of input utxos - random amount and send it back to sender
  // de
  // add it to mempool
  setTimeout(generateTransactions, 1000);
};

module.exports = { generateTransactions, startGenerating, stopGenerating };
