const axios = require('axios');
axios.get('http://localhost:1337/debug-check')
  .then(res => console.log('Debug response:', res.data))
  .catch(err => console.error('Server might not be running our version!'));
