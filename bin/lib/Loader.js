var nodePath = require('path');
var shell = require('shelljs')
var reg = require('./ioRegex')

// console.log(path)
class Loader {
  constructor (toLoad = false, config = {}) {
    let defaultConf = {
      allowedExt: ['.json'],
      ioFileName: 'io.json'
    }
    let conf = Object.assign(defaultConf, config)
    toLoad === false ? this.autoRun = true : this.autoRun = false
    this.allowedExt = conf.allowedExt
    if (this.autoRun)
      toLoad = shell.pwd().stdout // wil be a path
    this.ioFileName = conf.ioFileName
    this.isLoaded = false
    this._content = {}
    this.urlReg = reg.url
    this.absolutePathReg = reg.path.absolute
    if (typeof toLoad !== 'undefined') {
      this.content = toLoad
    }
  }
  static hasConfigFile () {
    
  }
  set content (val) {
    if (typeof val === 'object') {
      this._content = val
      this.url = val
    } else if (typeof val === 'string') {
      if (this.absolutePathReg.test(val)) {
        this.url = val
        this._content = this.load(val)
      } else if (this.urlReg.test(val)) {
        this.url = val
        this._content = this.download(val)
      }
    }
  }
  get content () {
    return typeof this._content === 'undefined' ? {} : this._content
  }
  each (callback) {
    for (let key in this.content) {
      let continu = callback(key, this.content[key])
      if (continu) {
        break
      }
    }
  }
  isExtAllowed (ext) {
    for (testExt of this.allowedExt) {
      if (testExt === ext) {
        return true
      }
    }
    return false
  }
  load (path) {
    try {
      let ioFile = require(nodePath.join(path, this.ioFileName))
      this.isLoaded = true
      return ioFile
    } catch (e) {
      this.isLoaded = false
      console.log(e)
      // if (!this.autoRun) {
      //   // console.log(e)
      // }
    }
  }
  download () {
  }
  // get parsedArgv () {
  //   let parsed = {}
  //   parsed.process = []
  //   this.absolutePathReg.test(process.argv[2]) ? parsed.process.io = process.argv[2] : parsed.process.io = process.argv[1]
  //   parsed.cmd = []
  //   parsed.options = []
  //   let index = 0
  //   for (let argv of process.argv) {
  //     if (/^([a-zA-Z]):(([\\]{1,2}|[\/])[a-zA-Z_-]*)*/.test(argv)) {
  //       let parseArgv = {
  //         path: argv,
  //         index
  //       }
  //       parsed.process.push(parseArgv)
  //     }
  //     if (/^[a-z]*$/.test(argv)) {
  //       let parseArgv = {
  //         name: argv,
  //         index
  //       }
  //       parsed.cmd.push(parseArgv)
  //     }
  //     if (/^--[a-z]{2,}/.test(argv)||/^-[a-z]{1}/.test(argv)) {
  //       let parseArgv = {
  //         name: argv,
  //         argIndex: index + 1,
  //         index
  //       }
  //       parsed.options.push(parseArgv)
  //     }
  //     index++
  //   }
  //   return parsed
  // }
}

module.exports = Loader
