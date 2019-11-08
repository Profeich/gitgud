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
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

//Commander init
program
  .version(version, '-v, --vers', 'output the current version');


program
  .command('s')
  .description('start git commands')
  .action((source, destination) => {
    //generating the commands
    const data = {q:[]};
    initQuestion1(data);
  });

program
  .command('t')
  .description('start test commands')
  .action((source, destination) => {
    //generating the commands
    let items = [];
    execSync('git branch -l').toString().split('\n').slice(0,-1 ).forEach((item) => {
      //if(!item.split('*')[0])items.push(item.split('*')[1].slice(1,item.length));
      //else items.push(item.slice(1,item.length));
      let req = /\w/;
      items.push(req.exec(item));
    });
    //const remotes = execSync('git branch -l').toString().split('\n').slice(0,-1).forEach(regg);
    console.log(items);
  });

function regg(item){
  if(item[0]==='*')item=item.slice(1,-1);
}

/**
*Programm to start the questioning about git commands
**/
async function initQuestion1(){
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
  const items = [];
  _.keys(q).forEach((item) => {if(/q3/.exec(item)) items.push(item.split('q3')[1]);});
  try{
    _.merge(answers, await inquirer.prompt(q.q1Sugg(items)));
    _.merge(answers, await inquirer.prompt(q[`q3${answers['command']}`]()));
  }catch(ex){console.error(ex);}
  const t = build(answers);
  exec(t, (error, stdout, stderr) => {
    console.log(chalk`{blue >>>}` + ' ' + chalk`{blue ${t}}`);
    if (stderr)printErr(stderr);
    if (stdout)printRes(stdout);
  });
}

if(process.argv.length === 2) process.argv.push('s');
program.parse(process.argv);
