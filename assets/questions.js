"use strict";
const fs          = require('fs');
const _           = require('lodash');
const { execSync }    = require('child_process');

const argList = {
  v: { value:'-v', name:'-v, Verbose output (more info)'},
  progress: { value:'--progress', name:'--progress, Show progression while working'},
  b: { value:'-b', name:'-b, Specific branch'},
  m: { value:'-m', name:'-m, Message to be used'},
  q: { value:'-q', name:'-q, Less Output'},
  all: { value:'--all', name:'--all, Send all references'},
  d: { value:'-d', name:'-d, Delete all references'},
  u: { value:'-u', name:'-u, Set upstream for pull/status'},
  f: { value:'-f', name:'-f, Force the command despite errors/warnings'},
  s: { value:'-s', name:'-s, Show output in a shorter format'},
  p: { value:'-p', name:'-p, Remove Remote-Tracking-Branches'},
  bare: { value:'--bare', name:'--bare, Create a bare-Repository'},
  addR: { value:'add', name:'add, Add a new remote'},
  remR: { value:'remove', name:'remove, Remove an old remote'},
  renR: { value:'rename', name:'rename, Rename a remote'},
  showR: { value:'show', name:'show, Show all remotes'},
  getuR: { value:'get-url', name:'get-url, Show the url of a specific remote'},
};
const remotes = execSync('git remote show').toString().split('\n').slice(0,-1);

module.exports.q1 = (items) => {
  return [{
        type: 'list',
        name: 'command',
        message: 'What git command do you need?',
        choices: items
      }];
};

module.exports.q3Pull = () => [
  {
      type: 'checkbox',
      name: 'options',
      message: 'do you whant any options?',
      choices: [
        '-b',
        '--progress'
      ]
    }
  ];

module.exports.q3Push = () => [
    {
      type: 'checkbox',
      name: 'options',
      message: 'do you whant any options?',
      choices: [
        argList.v,
        argList.q,
        argList.all,
        argList.d,
        argList.u
      ]
    },
    {
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
    }
  ];

module.exports.q3Fetch = () => [
  {
    type: 'checkbox',
    name: 'options',
    message: 'do you whant any options?',
    choices: [
      argList.v,
      argList.q,
      argList.p,
      argList.all
    ]
    }
  ];

module.exports.q3Init = () => [
  {
      type: 'checkbox',
      name: 'options',
      message: 'do you whant any options?',
      choices: [
        argList.q,
        argList.bare
      ]
    }
  ];

module.exports.q3Commit = () => [
  {
      type: 'checkbox',
      name: 'options',
      message: 'do you whant any options?',
      choices: [argList.m],
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
    }
  ];

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
  //const remotes = execSync('git remote show').toString().split('\n').slice(0,-1);
  return [{
        type: 'list',
        name: 'options',
        message: 'What remote command do you need?',
        choices: [argList.addR, argList.remR, argList.renR, argList.showR, argList.getuR]
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

module.exports.q3Status = () => [
  {
      type: 'checkbox',
      name: 'options',
      message: 'do you whant any options?',
      choices: [
        argList.v,
        argList.s,
        argList.b
      ]
      },{
        when: (response) => {
          if(_.includes(response.options, '-b')) return true;
        },
        name: 'text',
        type: 'list',
        message: 'Pls specify remote!',
        choices: remotes,
        filter(response){
          return new Promise((resolve, reject) =>{
            //resolve(`-m "${response}"`);
            resolve({'-b':response});
          });
        }
      }
    ];

module.exports.q3Status = () => [
  {
      type: 'checkbox',
      name: 'options',
      message: 'do you whant any options?',
      choices: [
        argList.v,
        argList.s,
        argList.b
      ]
      },{
        when: (response) => {
          if(_.includes(response.options, '-b')) return true;
        },
        name: 'text',
        type: 'list',
        message: 'Pls specify remote!',
        choices: remotes,
        filter(response){
          return new Promise((resolve, reject) =>{
            //resolve(`-m "${response}"`);
            resolve({'-b':response});
          });
        }
      }
    ];


module.exports.qForce = [
  {
      type: 'confirm',
      name: 'force',
      message: 'do you whant to force it?',
      default: false
    }
  ];

module.exports.q2 = [
  {
      type: 'confirm',
      name: 'update',
      message: 'Do you really whant to update?',
      default: true
    }];
