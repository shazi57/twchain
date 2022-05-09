require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { mine, startMining, stopMining } = require('./mine');

const app = express();

app.use(bodyParser.json());

app.post('/mining', (req, res) => {
  const { action } = req.body;
  console.log(action);
  switch (action) {
    case 'start':
      startMining();
      res.status(200).send('started mining');
      break;
    case 'stop':
      stopMining();
      res.status(200).send('stopped mining');
      break;
    default:
      console.log('should be either stop or start');
      res.status(500).send('should be either stop or start');
  }
});

app.listen(process.env.PORT, () => {
  mine();
  console.log(`listening to ${process.env.PORT}`);
});
