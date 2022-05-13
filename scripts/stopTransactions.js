const client = require('./client');

client.post('/generate', { action: 'stop' })
  .then((res) => {
    // console.log(res);
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err.message);
  });
