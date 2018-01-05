var shell = require("shelljs");
var each = require('lodash/forEach');
var fileExists = require('file-exists-promise');
var currentPath = shell.pwd().stdout;
var log = require('./debugger')
var path = require('path');
var alias = require('./alias');

module.exports = {
  ioPath: path.resolve(currentPath, './io.json'),
  ioConf: {},
  alias: {},
  modules: [],
  init () {
    var that = this
    return new Promise (function (resolve, reject) {
      that.findConfig().then(() => {
        that.ioConf = require(that.ioPath)
        alias.init(that.ioConf)
        .then((alias) => {
          that.alias = alias
          resolve(that)
        })
        .catch((e) => {
          reject(e)
        })
      }).catch(function (e) {
        reject(e)
      })
    })
  },
  findConfig () {
    return fileExists(this.ioPath)
  },
  runModule(name) {
    console.log('run' , name)
  },
  getModule(module) {
    // console.log(this.alias)
    module.urlParsed = this.alias.parseUrl(module.url)
    // log(module)
    return module
  },
  fetchModules (callback) {
    var that = this
    each(that.ioConf.modules, (v, k) => {
      if (typeof callback === 'function') {
        callback(this.getModule(v), k)
      }
    })
  }
}