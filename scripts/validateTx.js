const client = require('./client');

const TX_HASH = 

client.get('/mproof', { hash: TX_HASH })
  .then((res) => {
    // console.log(res);
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err.message);
  });
