require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { mine, startMining, stopMining } = require('./mine');
const db = require('./db');
const generateMiners = require('./generateMiners');
const { generateTransactions, startGenerating, stopGenerating } = require('./generateTransactions');

const app = express();

app.use(bodyParser.json());

app.post('/init', (_, res) => {
  generateMiners();

  for (let i = 0; i < 100; i += 1) {
    mine('false');
  }
  mine();
  generateTransactions();
  res.status(200).send('bulk update successful');
});

app.get('/balances', (_, res) => {
  const utxos = db.getData('/utxos');
  const nodes = db.getData('/nodes');
  const unSpentUtxos = utxos.filter((tx) => !tx.spent);
  const resultString = nodes.reduce((prev, miner, i) => {
    const { address } = miner;
    const sum = unSpentUtxos.reduce((p, c) => (c.owner === address ? p + c.amount : p), 0);
    return `${prev} Miner ${i} has balance of ${sum} \n`;
  }, '');
  res.status(200).send(resultString);
});

app.post('/generate', (req, res) => {
  switch (req.body.action) {
    case ('start'):
      startGenerating();
      res.status(200).send('transaction generation started');
      break;
    case ('stop'):
      stopGenerating();
      res.status(200).send('transaction generation stopped');
      break;
    default:
      res.status(400).send('body param has to be either start or stop');
      break;
  }
});

app.post('/mining', (req, res) => {
  switch (req.body.action) {
    case ('start'):
      startMining();
      res.status(200).send('mining started');
      break;
    case ('stop'):
      stopMining();
      res.status(200).send('minig stopped');
      break;
    default:
      res.status(400).send('body param has to be either start or stop');
      break;
  }
});

app.listen(process.env.PORT, () => {
  db.push('/', {
    blocks: [],
    utxos: [],
    nodes: [],
    mempool: [],
  });

  generateMiners();

  for (let i = 0; i < 10; i += 1) {
    mine('false');
  }
  mine();
  generateTransactions();
  console.log(`listening to ${process.env.PORT}`);
});
