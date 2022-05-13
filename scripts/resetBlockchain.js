const client = require('./client');

client.post('/reset')
  .then((res) => {
    // console.log(res);
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
  });
