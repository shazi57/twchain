const client = require('./client');
// console.log(client);

client.get('/balances')
  .then((res) => {
    // console.log(res);
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err.message);
  });
