const fs = require('fs');
const path = require('path');
const fileWriter = require('./filewriter');
const schemaIntepreter = require('./schemaIntepreter');
const valueFactory = require('./valueFactory');
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
  path = path.replace(/^\/+/, '');
  path = path.replace(/\/+$/, '');

  return path;
}

function sliceKey(config, key) {
  let cleanKey = key.replace(config.baseApiPath, '');
  let area = cleanPath(cleanKey);
  let segments = area.split('/').filter((x) => !x.includes('{'));
  return {
    area: segments[0],
    method: segments[1],
    fullPath: key
  }
} 

async function generateForPath(key, apiPath, spec, workspaceSettings, config) {
  let segment = sliceKey(config, key);
  const outputPath = path.join(workspaceSettings.collectionsPath, segment.area);
  generateFolder(outputPath);
  for (verb in apiPath) {
    await generateForVerb(verb, apiPath[verb], segment, spec, outputPath, workspaceSettings, config)
  }
}

function replacePathVariables(segment, operation) {
  var replacedPath = segment.fullPath;
  if (!operation.parameters) { 
    return replacedPath; 
  }

  for (let param of operation.parameters.filter((param) => param.in == 'path')) {
    replacedPath = replacedPath.replace(`{${param.name}}`, valueFactory.getValueFromType(param.schema.type))
  }

  const query = operation
                  .parameters
                  .filter((param) => param.in == 'query')
                  .map((x) => x.name+'='+valueFactory.getValueFromType(x.schema.type)).join('&');

  if (query != null && query != '') {
    replacedPath = replacedPath + '?' + query;
  }

  return replacedPath;
}

async function generateForVerb(verb, operation, segment, spec, apiOutputPath, workspaceSettings, config) {
  const lines = [];
  lines.push(`# @name ${verb}_${segment.area}_${segment.method}`)
  lines.push(`${verb.toUpperCase()} {{${config.baseUrlEnvKey}}}${replacePathVariables(segment,operation)}`)

  const schemaRef = schemaIntepreter.verbAcceptsJsonInput(operation);
  if (schemaRef != null) {
    lines.push("Content-Type: application/json");
    lines.push("");
    var postJson = schemaIntepreter.generateObjectFromRef(spec.components, schemaRef);
    const formattedJson = JSON.stringify(postJson, null, 2);
    lines.push(formattedJson);
  }

  await fileWriter.writeFileWithContents(path.join(apiOutputPath, verb+"_"+segment.method+"_"+operation.operationId+".http"), lines.join('\n'));
}

module.exports = { generateFolder, initializeWorkspace, initializeEnvironments, generateForPath, initializeYacConfig }