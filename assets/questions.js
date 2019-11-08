"use strict";
const fs          = require('fs');
const _           = require('lodash');
const { execSync }    = require('child_process');

const argList = {
  v: { value:'-v', name:'-v, Verbose output (more info)'},
  progress: { value:'--progress', name:'--progress, Show progression while working'},
  b: { value:'-b', name:'-b, Specific branch'},
  m: { value:'-m', name:'-m, Message to be used'},
  n: { value:'-n', name:'-n, No checkout'},
  q: { value:'-q', name:'-q, Less Output'},
  all: { value:'--all', name:'--all, Send all references'},
  d: { value:'-d', name:'-d, Delete all references'},
  u: { value:'-u', name:'-u, Set upstream for pull/status'},
  f: { value:'-f', name:'-f, Force the command despite errors/warnings'},
  s: { value:'-s', name:'-s, Show output in a shorter format'},
  nohardlinks: { value:'--no-hardlinks', name:'--no-hardlinks, Don´t use local links'},
  p: { value:'-p', name:'-p, Remove Remote-Tracking-Branches'},
  l: { value:'-l', name:'-l, List all remotes/branches'},
  lC: { value:'-l', name:'-l, Clone from local Repo'},
  bare: { value:'--bare', name:'--bare, Create a bare-Repository'},
  addR: { value:'add', name:'add, Add a new remote'},
  remR: { value:'remove', name:'remove, Remove an old remote'},
  renR: { value:'rename', name:'rename, Rename a remote'},
  showR: { value:'show', name:'show, Show all remotes'},
  getuR: { value:'get-url', name:'get-url, Show the url of a specific remote'},
};

module.exports.q1 = (items) => {
  return [{
        type: 'list',
        name: 'command',
        message: 'What git command do you need?',
        choices: items
      }];
};

module.exports.q1Sugg = (items) => {
  function searchItems(answers, input) {
    input = input || '';
    return new Promise((resolve, reject) => {
      const t = [];
      items.forEach((item) =>{
        if(_.includes(item.toLowerCase(), input.toLowerCase())) t.push(item);
      });
      resolve(t);
    });
  }

  return [{
      type: 'autocomplete',
      name: 'command',
      suggestOnly: false,
      message: 'What git command do you need?',
      source: searchItems,
      pageSize: 4,
      validate: function(val) {
        return val ? true : 'Type something!';
      },
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
  let remotes = execSync('git remote show').toString().split('\n').slice(0,-1);
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

module.exports.q3Status = () => {
  const remotes = execSync('git remote show').toString().split('\n').slice(0,-1);
  return [
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
  };

module.exports.q3Branch = () => [
  {
      type: 'checkbox',
      name: 'options',
      message: 'do you whant any options?',
      choices: [
        argList.v,
        argList.q,
        argList.u,
        argList.l,
      ]
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
      }
    ];

  module.exports.q3Clone = () => [
    {
        type: 'checkbox',
        name: 'options',
        message: 'do you whant any options?',
        choices: [
          argList.v,
          argList.q,
          argList.progress,
          argList.lC,
          argList.nohardlinks,
        ]
        },{
          name: 'argv',
          type: 'input',
          message: 'Pls specify: <repo> [<directory>]!',
          filter(response){
            return new Promise((resolve, reject) =>{
              //resolve(`-m "${response}"`);
              resolve([response]);
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
