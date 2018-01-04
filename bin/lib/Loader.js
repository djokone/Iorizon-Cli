var nodePath = require('path');
var shell = require('shelljs')
var reg = require('./ioRegex')

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
      toLoad = this.defaultPath
    this.reloaded = false
    this.ioFileName = conf.ioFileName
    this.isLoaded = false
    this.isFileLoaded = false
    this._content = {}
    this._reg = {
      url: reg.url,
      relativePath: reg.path.relative,
      absolutePath: reg.path.absolute
    }
    if (typeof toLoad !== 'undefined') {
      this.content = toLoad
    }
  }

  static hasConfigFile () {
    
  }
  get defaultPath () {
    if (this.reloaded === false) {
      this.reloaded = 0
    } else {
      this.reloaded ++
    }
    if (!this._defaultPath) {
      if (typeof process.cwd === 'function') {
        this._defaultPath = process.cwd()
      } else {
        this._defaultPath = __dirname
      } 
    }
    return this._defaultPath
  }

  set content (val) {
    if (typeof val === 'object') {
      this.type = 'object'
      this._content = val
      this.isLoaded = true
    } else if (typeof val === 'string') {
      let metaPath = nodePath.parse(val)
      if (metaPath.base && this.isExtAllowed(metaPath.ext)) {
        this.ioFileName = metaPath.base
      } else if (!metaPath.ext === '') {
        val = metaPath.dir
      }
      if (this._reg.relativePath.test(val)) {
        this.type = 'relativePath'
        this.url = val
        this.path = {
          relative: val,
          absolute: nodePath.resolve(this.defaultPath, val)
        }
        this._content = this.load(this.path.absolute, false)
      } else if (this._reg.absolutePath.test(val)) {
        this.type = 'absolutePath'
        this.url = val
        this._content = this.load(val)
      } else if (this._reg.url.test(val)) {
        this.type = 'url'
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
    for (let Ext of this.allowedExt) {
      if (Ext === ext) {
        return true
      }
    }
    return false
  }
  load (path, auto = true) {
    if (this.isExtAllowed(nodePath.parse(path).ext)) {
      auto = false
    }
    if (auto)
      path = nodePath.join(path, this.ioFileName)
    try {
      let ioFile = require(path)
      this.isFileLoaded = true
      this.isLoaded = true
      return ioFile
    } catch (e) {
      this.isFileLoaded = false
      return e
    }
  }
  download () {
  }
}

module.exports = Loader
