#!/bin/node
"use strict";
const { exec, execSync }    = require('child_process');
const chalk       = require('chalk');
const path        = require('path');
const program     = require('commander');
const _           = require('lodash');
const q           = require('./assets/questions.js');
const fs          = require('fs');
const version     = require('./package.json').version;

//Require init
const inquirer    = require('inquirer');

//Commander init
program
  .version(version, '-v, --vers', 'output the current version');


program
  .command('s')
  .description('start git commands')
  .action((source, destination) => {
    //generating the commands
    const data = {q:[]};
    _.keys(q).forEach((item) => {if(/q3/.exec(item)) data.q.push(item.split('q3')[1]);});
    initQuestion1(data);
  });

program
  .command('t')
  .description('start test commands')
  .action((source, destination) => {
    console.log('testing ground');
    async function getR() {
      const { stdout, stderr } = await exec('ls');
      return stdout;
    }
  });

program
  .command('update')
  .description('updates')
  .action((source, destination) => {
    inquirer.prompt(q.q2)
    .then(answer => {
      console.log(answer);
    }).catch(reason =>{
      console.error(reason);
    });
  });

/**
*Programm to start the questioning about git commands
*@param {object} data the commands generated from the module
**/
async function initQuestion1(data){
  function build(answers){
    if(answers.force) answers.force = '-f'; else answers.force = '';
    if(answers.argv) answers.argv = `${answers.argv}`; else answers.argv = '';
    if(typeof answers.options != []) answers.options = [answers.options];

    let ans='';
    if(answers.text === undefined){
      if(answers.options){answers.options.forEach(item => {
        ans += `${item} `;
      });}
    }else{
      if(answers.options){answers.options.forEach(item => {
        if(answers.text[item]) ans += `${item} ${answers.text[item]} `;
        else ans += `${item} `;
      });}
    }

    return `git ${answers.command.toLowerCase()} ${ans}${answers.force}${answers.argv}`;
  }

  function printRes(result){
    let l = '';
    result.split('\n').slice(0,-1).forEach((item) => {
      l += (chalk`{blue >>>}`+ ' ' + chalk`{green ${item}} \n`);
    });
    console.log(l);
  }
  function printErr(err){
    let l = '';
    err.split('\n').slice(0,-1).forEach((item) => {
      l += (chalk`{blue >>>}`+ ' ' + chalk`{red ${item}} \n`);
    });
    console.log(l);
  }
  const answers = {};
  try{
    _.merge(answers, await inquirer.prompt(q.q1(data.q)));
    _.merge(answers, await inquirer.prompt(q[`q3${answers.command}`](data)));
  }catch(ex){console.error(ex);}
  const t = build(answers);
  console.log(chalk`{blue >>>}` + ' ' + chalk`{blue ${t}}`);
  exec(t, (error, stdout, stderr) => {
    if (stderr)printErr(stderr);
    if (stdout)printRes(stdout);
  });
}

if(process.argv.length === 2) process.argv.push('s');
program.parse(process.argv);
