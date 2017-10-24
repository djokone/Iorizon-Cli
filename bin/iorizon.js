#! /usr/bin/env node
var shell = require("shelljs");
var program = require('commander');

var currentPath = shell.pwd()
var scriptFolder = process.argv[1]

program
  .version('0.1.0')
  .arguments('<cmd> [env]')
  .action(function (cmd, env) {
     cmdValue = cmd;
     envValue = env;
  });
program.parse(process.argv);
if (typeof cmdValue === 'undefined') {
   console.error('no command given!');
   process.exit(1);
}
if (cmdValue === 'init') {
  var init = require('./init.js');
  init.start()
}
console.log('command:', cmdValue);
console.log('environment:', envValue || "no environment given");

console.log('iorizon start ' + currentPath)
// console.log(process)
// console.log(scriptFolder)
// console.log(process.argv)
// console.log('iorizon start')