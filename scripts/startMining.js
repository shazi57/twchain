const client = require('./client');
// console.log(client);

client.post('/mining', { action: 'start' })
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err.message);
  });
