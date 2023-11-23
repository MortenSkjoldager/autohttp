const configservice = require('../configservice');
const openapiservice = require('../openapiservice');
const workspaceservice = require('../workspaceservice');
const generator = require('../generator');
const nuke = require('./nuke');
async function run() {
    var config = await configservice.loadConfig();
    var spec = await openapiservice.getApiSpec(config.entrypoint);
    var workspaceSettings = await workspaceservice.getWorkspaceSettings(config);
    
    generator.initializeWorkspace(workspaceSettings);
    generator.initializeEnvironments(workspaceSettings, config);
    generator.initializeYacConfig(workspaceSettings, config);
    
    if (config.genMode == 'nuke') {
        await nuke();
    }

    for (let key in spec.paths) {
        await generator.generateForPath(key, spec.paths[key], spec, workspaceSettings, config);
    }
}

module.exports = run