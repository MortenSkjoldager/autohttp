const https = require('https');
const axios = require('axios');

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

async function getApiSpec(apiendpoint) {
  try {
    const response = await instance.get(apiendpoint);
    return response.data;

    // Resten af din kode, der afhænger af response, kan placeres her
  } catch (error) {
    throw new Error(`Error fetching data from url: ` + error.message);
  }
}

module.exports = { getApiSpec };