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

function generateVariableNameFromOperation(operation, parameter) {
  return operation.operationId+'_'+parameter.name;
}

function getValueOrVariable(operation, parameter, config) {
  if (config.pathAndQueryMode != null && config.pathAndQueryMode == 'var') {
    return '{{'+generateVariableNameFromOperation(operation, parameter)+'}}';
  }

  return valueFactory.getValueFromType(parameter.schema.type);
}

function replacePathVariables(segment, operation, config) {
  var replacedPath = segment.fullPath;
  if (!operation.parameters) { 
    return replacedPath; 
  }

  for (let param of operation.parameters.filter((param) => param.in == 'path')) {
    replacedPath = replacedPath.replace(`{${param.name}}`, getValueOrVariable(operation, param, config))
  }

  const query = operation
                  .parameters
                  .filter((param) => param.in == 'query')
                  .map((x) => x.name+'='+getValueOrVariable(operation, x, config)).join('&');

  if (query != null && query != '') {
    replacedPath = replacedPath + '?' + query;
  }

  return replacedPath;
}

async function generateForVerb(verb, operation, segment, spec, apiOutputPath, workspaceSettings, config) {
  const lines = [];
  if (config.pathAndQueryMode && config.pathAndQueryMode == 'var' && operation.parameters && Array.isArray(operation.parameters)) {
    for (let parameter of operation.parameters) {
      lines.push('@'+generateVariableNameFromOperation(operation, parameter)+'='+valueFactory.getValueFromType(parameter.schema.type))
    }
  }

  lines.push(`# @name ${verb}_${segment.area}_${operation.operationId}`)
  lines.push(`${verb.toUpperCase()} {{${config.baseUrlEnvKey}}}${replacePathVariables(segment,operation, config)}`)
  lines.push('\n');
  const schemaRef = schemaIntepreter.verbAcceptsJsonInput(operation);
  if (schemaRef != null) {
    lines.push('Content-Type: application/json');
    lines.push('\n');
    var postJson = schemaIntepreter.generateObjectFromRef(spec.components, schemaRef);
    const formattedJson = JSON.stringify(postJson, null, 2);
    lines.push(formattedJson);
  }

  await fileWriter.writeFileWithContents(path.join(apiOutputPath, verb+"_"+operation.operationId+".http"), lines.join('\n'));
}

module.exports = { generateFolder, initializeWorkspace, initializeEnvironments, generateForPath, initializeYacConfig }