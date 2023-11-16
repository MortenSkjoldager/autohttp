const fs = require('fs-extra');

const defaultConfig = {
    "entrypoint": "https://localhost:44386/swagger/v1/swagger.json",
    "outputPath": "./httpcollection",
    "collectionsPath": "./collections",
    "envPath": "./env",
    "generateYacConfig": true,
    "environments": [
        {
            "key": "env",
            "variables": {
                "baseUrl": "https://localhost:44386/"
            }
        },
        {
            "key": "stage",
            "variables": {
                "baseUrl": "https://stage.mysubdomain.com:44386/"
            }
        }
    ]
};

const options = {
    spaces: 2, // Antal mellemrum for at bruge som indrykning
    EOL: '\r\n', // Linjeskift
  };

async function init() {
    const path = process.cwd() + '\\autohttp.json';
    if (fs.existsSync(path)) {
        console.log('config file already exists...');
        return;
    }
    fs.writeJson(path, defaultConfig, options)
    .then(() => {
      console.log('Default config created...');
    })
    .catch((err) => {
      console.error('Error writing config file:', err);
    });
}

module.exports = init;