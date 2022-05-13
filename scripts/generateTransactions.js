const client = require('./client');

client.post('/generate', { action: 'start' })
  .then((res) => {
    // console.log(res);
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err.message);
  });
