// var each = require('lodash/forEach')
// var log = require('./debugger')
var Loader = require('./Loader')
var path = require('path')

class AliasLoader extends Loader{
  constructor (ioConf) {
    super(ioConf)
    this.paths = {}
    var that = this
    this.aliasReg = /(@[a-zA-Z0-9]+)/
    this.each((k, v) => {
      that.addPath(k, v)
    })
  }
  parseUrl (url) {
    if (this.hasAlias(url)) {
      var that = this
      let res = this.findAlias(url)
      res.alias.forEach((v, k) => {
        url = path.resolve(url.replace(that.aliasReg, that.getPath(v.name)))
      })
    }
    return url
  }
  hasAlias (url) {
    return new RegExp(this.aliasReg).test(url)
  }
  findAlias (url, action) {
    // const regex = /(@[a-zA-Z0-9]*)\//g
    var that = this
    var result = {}
    // result.url = url
    result.alias = []
    var reg = new RegExp(this.aliasReg, 'g')
    let m
    while ((m = reg.exec(url)) !== null) {
      if (m.index === that.aliasReg.lastIndex) {
        that.aliasReg.lastIndex++;
      }
      var alias = {
        match: m[1],
        name: m[1].replace('@', ''),
        position: m.index
      }
      // alias.url = that.getPath(alias.name)
      if (typeof action === 'function') {
        action(alias)
      }
      result.alias.push(alias)
    }
    // console.log(result)
    return result;
  }
  getPath (alias) {
    if (typeof this.paths[alias] !== 'undefined') {
      return this.paths[alias]
    } else {
      throw new Error('Can\'t find alias : "' + alias + '", are you sure that the alias has been registred before ?')
      return false
    }
  }
  addPath (alias, url) {
    this.paths[alias] = this.parseUrl(url)
  }
}

module.exports = AliasLoader
