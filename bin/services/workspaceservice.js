const path = require('path');

async function getWorkspaceSettings(config) {
    return {
      outputPath: path.join(process.cwd(), config.outputPath)
    }  
}

module.exports = { getWorkspaceSettings };