#! /usr/bin/env node
var shell = require("shelljs");
var program = require('commander');
var emoji = require('node-emoji');
var colors = require('colors');
var unicorn = require('unicorn').install();
var formPhrase = require('font-ascii').default

var currentPath = shell.pwd();
var scriptFolder = process.argv[1];
var routes = require('./routes.js')

routes.init()
routes.map()
routes.dispatch()

colors.setTheme({
  silly: 'trap',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

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
let selection = ['Slant']
if (cmdValue === 'init') {
  var init = require('./init.js');
  // formPhrase('wellcome', { typeface: 'DancingFont', color: 'grey', verbose: false });
  // formPhrase('iorizon', { typeface: 'DancingFont', color: 'grey', verbose: false });
  formPhrase('  io', { typeface: 'DancingFont', color: 'grey', verbose: false });
  formPhrase('  iorizon', { typeface: 'Slant', color: 'grey', verbose: false });
  init.start()
}
console.log('command:', cmdValue);
console.log('environment:', envValue || "no environment given");

console.log('iorizon start ' + currentPath + "")
let StartingMessage = emoji.emojify(':fire: Ready to start :fire:');
StartingMessage = colors.input(StartingMessage)
console.log(StartingMessage);
// console.log(process)
// console.log(scriptFolder)
// console.log(process.argv)
// console.log('iorizon start')