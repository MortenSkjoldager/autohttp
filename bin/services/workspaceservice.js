const path = require('path');

async function getWorkspaceSettings(config) {
    const outputPath = path.join(process.cwd(), config.outputPath);
    return {
      outputPath: outputPath,
      collectionsPath: path.join(outputPath,config.collectionsPath),
      envPath: path.join(outputPath,config.envPath)
    }  
}

module.exports = { getWorkspaceSettings };