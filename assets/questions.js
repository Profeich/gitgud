"use strict";
const fs          = require('fs');
const _           = require('lodash');
const { execSync }    = require('child_process');

/*
module.exports.q1 = [{
      type: 'list',
      name: 'command',
      message: 'What git command do you need?',
      choices: [
        'pull',
        'push',
        'fetch',
        'init',
        'commit'
      ]
    }];
*/

module.exports.q1 = (items) => {
  return [{
        type: 'list',
        name: 'command',
        message: 'What git command do you need?',
        choices: items
      }];
};

module.exports.q3Pull = () => [{
      type: 'checkbox',
      name: 'options',
      message: 'do you whant any options?',
      choices: [
        '-b',
        '-h',
        '--progress'
      ]
    }];

module.exports.q3Push = () => [{
      type: 'checkbox',
      name: 'options',
      message: 'do you whant any options?',
      choices: [
        '-v',
        '-q',
        '--all',
        '-d',
        '-u']
    },{
      when: (response) => {
        if(_.includes(response.options, '-u')) return true;
      },
      name: 'text',
      type: 'input',
      message: 'Pls specify: <origin> <master>',
      filter(response){
        return new Promise((resolve, reject) =>{
          //resolve(`-m "${response}"`);
          resolve({'-u': `${response}`});
        });
      }
    }];

module.exports.q3Fetch = () => [{
    type: 'checkbox',
    name: 'options',
    message: 'do you whant any options?',
    choices: [
      '-v',
      '-q',
      '-p',
      '--all',
      '-a']
    }];

module.exports.q3Init = () => [{
      type: 'checkbox',
      name: 'options',
      message: 'do you whant any options?',
      choices: ['-q', '--bare']
    }];

module.exports.q3Commit = () => [{
      type: 'checkbox',
      name: 'options',
      message: 'do you whant any options?',
      choices: ['-m'],
      default: ['-m']
    },{
      when: (response) => {
        if(_.includes(response.options, '-m')) return true;
      },
      name: 'text',
      type: 'input',
      filter(response){
        return new Promise((resolve, reject) =>{
          //resolve(`-m "${response}"`);
          resolve({'-m': `"${response}"`});
        });
      }
    }];

module.exports.q3Add = () => {
  function getLS(){
    const arr = [];
    fs.readdirSync(process.cwd()).forEach(file => {
      arr.push(file);
    });
    return arr;
  }
  return [{
        type: 'checkbox',
        name: 'options',
        message: 'Which Files do you need to add?',
        choices: _.concat(getLS(), '*')
      }];
};

module.exports.q3Remote = () => {
  const remotes = execSync('git remote show').toString().split('\n').slice(0,-1);
  return [{
        type: 'list',
        name: 'options',
        message: 'What remote command do you need?',
        choices: ['add', 'remove', 'rename', 'show', 'get-url']
      },{
        when: (response) => {
          if(response.options === 'add') return true;
        },
        name: 'text',
        type: 'input',
        message: 'Pls specify: <name> <url>',
        filter(response){
          return new Promise((resolve, reject) =>{
            //resolve(`-m "${response}"`);
            resolve({'add' : response});
          });
        }
      },{
        when: (response) => {
          if(response.options === 'remove') return true;
        },
        name: 'text',
        type: 'list',
        message: 'Pls specify!',
        choices: remotes,
        filter(response){
          return new Promise((resolve, reject) =>{
            //resolve(`-m "${response}"`);
            resolve({'remove' : response});
          });
        }
      },{
        when: (response) => {
          if(response.options === 'rename') return true;
        },
        name: 'text',
        type: 'list',
        message: 'Pls Specify oldName!',
        choices: remotes,
        filter(response){
          return new Promise((resolve, reject) =>{
            //resolve(`-m "${response}"`);
            resolve({'rename' : response});
          });
        }
      },{
        when: (response) => {
          if(response.options === 'rename') return true;
        },
        name: 'argv',
        type: 'input',
        message: 'Pls specify NewName!',
        filter(response){
          return new Promise((resolve, reject) =>{
            //resolve(`-m "${response}"`);
            resolve(response);
          });
        }
      },{
        when: (response) => {
          if(response.options === 'get-url') return true;
        },
        name: 'argv',
        type: 'list',
        message: 'Pls specify remote!',
        choices: remotes,
        filter(response){
          return new Promise((resolve, reject) =>{
            //resolve(`-m "${response}"`);
            resolve(response);
          });
        }
      }];
};

module.exports.q3Status = () => [{
      type: 'checkbox',
      name: 'options',
      message: 'do you whant any options?',
      choices: [
        '-v',
        '-s',
        '-b'
      ]
      }];

module.exports.qForce = [{
      type: 'confirm',
      name: 'force',
      message: 'do you whant to force it?',
      default: false
    }];
module.exports.q2 = [
  {
      type: 'confirm',
      name: 'update',
      message: 'Do you really whant to update?',
      default: true
    }];
