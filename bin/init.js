#! /usr/bin/env node
const jq = require('node-jq') // to manipulate JSON
var shell = require("shelljs");
var fs = require('fs');

module.exports = {
  initPath: 'io.json',
  ioFile: false,
  start: function(msg) {
    // jq.run(io.json)
    this.initialize()
    jq.run('')
    return this;
  },
  initialize: function() {
    try {
      this.ioFile = fs.statSync(this.initPath);
      console.log(this.ioFile)
    } catch (e) {
      this.createIoConfig()
    }
    console.log('test')
    return this;
  },
  createIoConfig: function() {
    console.log('createIoConfig')
  }
};
