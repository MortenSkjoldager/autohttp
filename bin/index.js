#! /usr/bin/env node 
const api = require('./services/api');

const { program } = require('commander');

program
    .name('autohttp')
    .version('1.0.0')
    .description('A CLI for generating .http files from openAPI spec')

program
    .command('workspacenuke')
    .description('nukes your workspace. WARNING HERE BE DRAGONS. All manual work  will be lost under your worksapce.')
    .action(() => {
        api.nuke();
    });

program
    .command('run')
    .description('Runs the generation')
    .action(() => {
        api.run();
    });

program
    .command('init')
    .description('init a config to run the autohttp tools')
    .action(() => {
        api.init();
    });

program.parse(process.argv);