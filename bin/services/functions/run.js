const configservice = require('../configservice');
const openapiservice = require('../openapiservice');
const workspaceservice = require('../workspaceservice');
const generator = require('../generator');

async function run() {
    var config = await configservice.loadConfig();
    var spec = await openapiservice.getApiSpec(config.entrypoint);
    var workspaceSettings = await workspaceservice.getWorkspaceSettings(config);
    generator.initializeWorkspace(workspaceSettings);
    generator.initializeEnvironments(workspaceSettings, config)
    for(key in spec.paths) {
        generator.generateFolder({
            outputPath: workspaceSettings.collectionsPath,
            key: key
        });
    }
}

module.exports = run