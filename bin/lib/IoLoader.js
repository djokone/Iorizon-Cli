var Loader = require('./Loader')
var aliasLoader = require('./AliasLoader')
var ModuleLoader = require('./ModuleLoader')
var OptionsLoader = require('./OptionsLoader')
var reg = require('./ioRegex')
var resolve = require('path').resolve
var isEmpty = require('lodash/isEmpty')
var color = require('chalk')

class IoLoader extends Loader {
  constructor (ioConf = false, isGlobal = false, autoRun = false) {
    if (ioConf === false) {
      super()
    } else {
      super(ioConf)
    }
    this.ioConf = ioConf
    this.isGlobal = isGlobal
    // console.log(__dirname)
    this.Loaders = {}
    this._child = {}
    this._options = false
    this.argv = false
    if (typeof this.content.options !== 'undefined') {
      this._options = new OptionsLoader(this.content.options)
    }
    if (typeof this.content.alias !== 'undefined' && this.content.alias) {
      this.alias = new aliasLoader(this.content.alias)
    }
    if (typeof this.content.modules !== 'undefined') {
      this.modules = new ModuleLoader(this.content.modules, this.alias)
    }
    // if (autoRun) {
    //   this.runModule()
    // }
    // console.log(this.hasChildProcess)
    // if (this.hasChildProcess) {
    //   this.child = process.argv[2]
    //   this.globalPath = process.argv[2]
    //   // console.log(process.argv)
    //   process.argv.splice(2, 1)
    // } else {
    //   this.globalPath = process.argv[1]
    // }
  }
  static absolutePathReg () {
    return this.absolutePathReg
  }
  get options () {
    let options = {}
    this._options.each((v, k) => {
      let opt = this._options.get(v)
      options[opt.meta.option.name] = opt.value
      if (reg.alias.test(opt.value)) {
        options[opt.meta.option.name] = this.alias.parseUrl(opt.value)
      }
    })
    return options
  }
  get child () {
    return this._child
  }
  set argv (val) {
    if (val) {
      if (typeof this.modules !== 'undefined') {
        this.modules.argv = val
      }
    }
  }
  set child (value) {
    this._child = {
      ioConfPath: resolve(value, '../../io.json'),
      path: value
      // IoLoader: new IoLoader(resolve(value, '../../'))
    }
  }
  get hasChildProcess () {
    return this.absolutePathReg.test(process.argv[2])
  }
  runModule (module) {
    this.modules.run(module)
  }
  get name () {
    if (typeof this.content === 'undefined' || typeof this.content.name === 'undefined') {
      console.warn(color.blue('Don\'t forget to add a name to your io conf file'))
      return "unknow"
    } else if (typeof this._name !== 'undefined') {
      return this._name
    } else {
      return this.content.name
    }
  }
}

module.exports = IoLoader
