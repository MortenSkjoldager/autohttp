const fs = require('fs');
const path = require('path');

function generateFolder(folderRequest) {
    const outPath = path.resolve(process.cwd(), folderRequest.outputPath);
    const localPath = folderRequest.key;
    const fullPath = path.join(outPath, localPath);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
}

function initializeWorkspace(config) {
    const outputPath = config.outputPath;
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
      console.log(`Directory created: ${outputPath}`);
    } else {
      console.log(`Directory already exists: ${outputPath}`);
    }
}

function initializeEnvironments() {

}

module.exports = { generateFolder, initializeWorkspace, initializeEnvironments }