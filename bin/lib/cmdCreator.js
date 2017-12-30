
var program = require('commander');
var package = require('../../package.json');
var FS = require("q-io/fs");

program.version(package.version)

const commands = __dirname + '/../cmd'
FS.list(commands)
  .then(function (files) {
    files.forEach((v, k) => {
      cmdConf = require(commands + '/' + v).cmdConfig
      program.command(...cmdConf.command)
    })
    console.log('list dirname')
    console.log(files)
  })
  .catch(function (e) {
    console.error("Can't find the foler you'be asked : " + commands)
    console.log(e)
  })

program.parse(process.argv);