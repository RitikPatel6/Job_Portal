const axios = require('axios');
axios.get('http://localhost:1337/api/interviews/4')
  .then(res => console.log('Response data:', JSON.stringify(res.data, null, 2)))
  .catch(err => console.error(err));
