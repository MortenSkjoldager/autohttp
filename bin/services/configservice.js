const fs = require('fs');
const path = require('path');

async function loadConfig() {
  try {
    const configFilePath = path.resolve(process.cwd(), 'autohttp.json');
    const configFileContents = fs.readFileSync(configFilePath, 'utf8');
    const config = JSON.parse(configFileContents);
    return config;

  } catch (error) {
    throw new Error('Error loading config: ' + error.message);
  }
}

module.exports = { loadConfig };