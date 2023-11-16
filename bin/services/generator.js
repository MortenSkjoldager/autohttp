const fs = require('fs');
const path = require('path');
const fileWriter = require('./filewriter');

function generateFolder(fullPath) {

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
}

function initializeYacConfig(workspaceSettings, config) {
  if (!config.generateYacConfig) {
    return;
  } 

  const contents = 
  `module.exports = {
    log: {
      supportAnsiColors: true,
    },
    cookieJarEnabled: true,
    request: {
      https:  {
        rejectUnauthorized: false
       }
    }
  }`

  fileWriter.writeFileWithContents(workspaceSettings.yacConfig, contents)

}

function createIfNotExists(fullPath) {
  const outputPath = fullPath;
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
    //created
  } else {
    //folder already exists.
  }
}

function initializeWorkspace(config) {
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

function cleanPath(path) {
  // Fjern forreste skråstreg
  path = path.replace(/^\/+/, '');

  // Fjern bageste skråstreg
  path = path.replace(/\/+$/, '');

  return path;
}

function sliceKey(config, key) {
  let area = cleanPath(key);
  let segments = area.split('/')
  return {
    area: segments[0],
    method: segments[1]
  }
} 

function generateForPath(key, apiPath, workspaceSettings, config) {

  let segment = sliceKey(config, key);
  const outputPath = path.join(workspaceSettings.collectionsPath, segment.area);
  generateFolder(outputPath);
  for (verb in apiPath) {
    generateForVerb(verb, apiPath[verb], segment, outputPath, workspaceSettings, config)
  }
  // fileWriter.writeFileWithContents();

}

function generateForVerb(verb, operation, segment, apiOutputPath, workspaceSettings, config) {
  console.log(apiOutputPath);
  console.log(segment);
  fileWriter.writeFileWithContents(path.join(apiOutputPath, verb+"_"+segment.method+".http"), "hello world");
}

module.exports = { generateFolder, initializeWorkspace, initializeEnvironments, generateForPath, initializeYacConfig }