const fs = require('fs');
const path = require('path');
const fileWriter = require('./filewriter');

function generateFolder(folderRequest) {
    const outPath = path.resolve(process.cwd(), folderRequest.outputPath);
    const localPath = folderRequest.key;
    const fullPath = path.join(outPath, localPath);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
}

function createIfNotExists(fullPath) {
  const outputPath = fullPath;
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
    console.log(`Directory created: ${outputPath}`);
  } else {
    console.log(`Directory already exists: ${outputPath}`);
  }
}

function initializeWorkspace(config) {
    console.log(config)
    createIfNotExists(config.outputPath);
    createIfNotExists(config.collectionsPath);
    createIfNotExists(config.envPath);
}

function initializeEnvironments(workspaceSettings, config) {
    for (let env of config.environments) {
        var contents = Object.keys(env.variables).map(x => x+"="+env.variables[x]);
        fileWriter.writeFileWithContents(path.join(workspaceSettings.envPath, env.key+".env"), contents.join("\n"));
    }
}

module.exports = { generateFolder, initializeWorkspace, initializeEnvironments }