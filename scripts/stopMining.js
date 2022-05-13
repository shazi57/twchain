const client = require('./client');

client.post('/mining', { action: 'stop' })
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err.message);
  });
