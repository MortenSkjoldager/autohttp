const workspaceservice = require('../workspaceservice');
const configservice = require('../configservice');
const fsekstra = require('fs-extra');

async function nuke() {
    var config = await configservice.loadConfig();
    var settings = await workspaceservice.getWorkspaceSettings(config);

    await fsekstra.remove(settings.outputPath)
    .then(() => {
      console.log('Mappen er slettet.');
    })
    .catch(err => {
      console.error('Fejl under sletning af mappen:', err);
    });
}

module.exports = nuke;