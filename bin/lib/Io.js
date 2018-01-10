var IoLoader = require('./IoLoader')
var path = require('path');
var fs = require('fs');
var utils = require('./utils');
var shell = require("shelljs");
const reg = require('./ioRegex')
require('../lib/debugger')
// console.log(__dirname)
class Io {
  constructor (digest = false) {
    this.globalFolder = 'iorizon-cli'
    this.iorizonCliPathFolder = 'iorizon-cli/bin/iorizon'
    this.ioFile = 'io.json'
    this.commandPriority = ['current', 'global']
    this._globalPath = false
    this._argv = false
    this.isInit = false
    if (!digest) {
      this.init()
    }
    this.globalInit()
    this.ioRequire()
  }
  ioRequire () {
    console.log('io Require')
    require = new Proxy (require, {
      apply: function (target, thisArg, argument) {
        console.log(target)
        console.log(thisArg)
        console.log(argument)
      }
    })
  }
  globalInit () {
    // console.log(this.modulePath)
    if (this.inModule && this.modulePath) {
      this.module = this.argv.current.loader
      // this.module.argv = this.argv
      this.hasModule = true
    }  else {
      this.hasModule = false
    }
    // console.log(this)
    this.global = new IoLoader(this.pathToIoFile(this.globalPathFile))
    this.global.argv = this.argv
  }
  get cmd () {
    if (typeof this.argv.current !== 'undefined' && Array.isArray(this.argv.current.cmd)) {
      for (let cmd in this.argv.current.cmd) {
        return cmd
        break
      }
      return false
    } else if (Array.isArray(this.argv.cmd)) {
      for (let cmd in this.argv.cmd) {
        return cmd
        break
      }
      return false
    }
  }
  init () {
    this.current = new IoLoader()
    // this.current.argv = this.argv
    // if (this.argv.current.cmd) {
    //   for (let cmd in this.argv.current.cmd) {
    //     this.cmd = cmd
    //     break
    //   }
    // } else { this.cmd = this.argv.current.cmd }
    // console.log(this.argv)
    // this.cmd = this.argv.current.hasCmd ? this.argv.current.cmd.name : false
    // this.cmd = this.argv.cmd.length > 0 ? this.argv.cmd[0].name : false
    // console.log(this.cmd)
    this.isInit = true
  }
  get hasCurrentModules () {
    return typeof this.current.content.modules !== "undefined"
  }
  get options () {
    let res = this._initOptions()
    if (this.hasModule && this.current.modules.getModuleOptions(this.parentCmd[0])) {
      let currentRes = this.current.modules.getModuleOptions(this.parentCmd[0])
      res = Object.assign({}, res, currentRes)
    }
    return res
  }
  _initOptions () {
    let res = {}
    let current = this.argv.current
    current.loader._options.each((v, k) => {
      let opt = current.loader._options.get(v)
      res[opt.meta.option.name] = opt.value
    })
    for (let cmd in current.cmd) {
      for (let option in current.cmd[cmd].options) {
        let opt = current.cmd[cmd].options[option]
        res[option] = opt.value
      }
    }
    return res
  }
  addOptions (key, value) {
    // console.log(this.argv.current)
  }
  /**
   * Run the current sub command
   */
  runSubCommand () {
    if (this.isInit) {
      if (this.cmd) {
        // if (typeof this.argv.options.deep === 'undefined') {
        //   globalOptions = ['--deep', 1]
        // } else {
        //   globalOptions = ['--deep', this.argv.options.deep++]
        // }
        // console.log(this.current.modules.has(this.cmd))
        // console.log(this)
        // console.log(this.hasModule)
        if ((this.hasModule) && this.inModule && this.module.isLoaded && this.module.modules.has(this.cmd)) {
          this.module.modules.run(this.cmd, this.argv)
        } else if (this.hasCurrentModules && this.current.isLoaded && this.current.modules.has(this.cmd)) {
          this.current.modules.run(this.cmd, this.argv)
        } else if (this.global.isLoaded && this.global.modules.has(this.cmd)) {
          this.global.modules.run(this.cmd, this.argv)
        } else {
          console.warn('This cmd : ' + this.cmd + ', doesn\'t exist')
        }
      }
    } else {
      console.error('You have to call init() function before running subcommands !')
    }  
  }
  /**
   * Parse node js process.argv array to an object
   * @param  {[Array]} argvs [Process argv array to parse]
   * @return {[Object]}      [Object with path, cmd and options sort out]
   * 
   * @exemples
   * e:\sites\Projets\ImperialInternational\imperial-cakephp3
   * $ io --global build --silent save
   * 
   * e:\sites\Projets\ImperialInternational\imperial-cakephp3\io.json
   * "modules": {
   *    "build": {
   *      "url": "e:\sites\factory\buildManager"
   *    }
   * }
   * 
   * e:\sites\factory\buildManager\io.json
   * "options": {
   *   "--silent": [true]
   * }
   * "modules": {
   *   "save": {
   *     "url": "./bin/save"
   *    }
   * }
   * last spawn 
   * argvs = []
   * @todo 
   * Make a proper deep object
   ********************************/
  parseArgv (argvs = process.argv) {
    // console.log(argvs)
    let parsed = {}
    parsed.process = []
    parsed.all = argvs.slice(1)
    // reg.path.absolute.test(argvs[2]) ? parsed.process.io = argvs[2] : parsed.process.io = argvs[1]
    parsed.process.all = []
    parsed.cmd = []
    parsed.options = {}
    let index = 0
    let prev = {}
    let meta = {
      processCount: 0,
      cmdProcessCount: 0,
      cmdCount: 0,
      optionsCount: 0,
      current: {
        process: -1
      }
    }
    let currentProcess = 0
    // Each argv throw the spwan node script
    for (let argv of argvs) {
      // console.log(argv)
      meta.current.argv = argv
      meta.current.index = index
      let data = {}
      // If it is a path, so it's a process
      if (reg.path.absolute.test(argv)) {
        meta.options = {}
        meta.cmd = false
        meta.process = {}
        meta.cmdProcessCount = 0
        meta.current.process++
        let ioPath = this.pathToIoFile(argv)
        meta.current.ioPath = ioPath
        let loader = false
        if (ioPath !== false) {
          // ioPath = path.normalize(path.resolve(ioPath, this.ioFile))
          // console.log(ioPath)
          loader = new IoLoader(ioPath)
        }
        data = {
          process: argv,
          loader,
          cmd: false,
          options: {},
          currentCmd: {},
          cmdLength: meta.cmdProcessCount,
          hasCmd: false
        }
        meta.process.global = false
        if (index === 1) {
          meta.process.key = 'current'
          parsed.current = data
          parsed.childs = []
        } else if (index > 1) {
          meta.process.key = 'childs'
          parsed.childs.push(data)
          meta.process.indexKey = parsed.childs.length - 1
        }
        if (this.isPathGlobal(argv)) {
          meta.process.global = true
          meta.process.type = 'process'
          meta.process.value = argv
          meta.process.key = 'global'
          parsed.global = data
          parsed.global.options = {}
        }
      }
      let hasOptionsHandled = typeof meta.options !== 'undefined' && 
        typeof meta.options.handle !== 'undefined' && 
        meta.options.handle > 0
      let cmdKey = 'cmd'

      if (!hasOptionsHandled && reg.cmd.test(argv)) {
        meta.cmdProcessCount++
        // console.log(meta)
        if (meta.cmdProcessCount === 1 && !meta.process.global) {
          cmdKey = 'currentCmd'
        }
      }
      let target
      // Handle the reference to manipulate it in next conditions
      if (meta.process.global) {
        target = parsed.global
      } else if (meta.process.key === 'childs') {
        target = parsed[meta.process.key][meta.process.indexKey]
      } else {
        target = parsed[meta.process.key]
      }

      // console.log(reg.cmd.test(argv))
      // if (meta.cmdProcessCount) {}
      // if it's a options value
      if (
        hasOptionsHandled
        ) {
        let targetOpt
        if (meta.cmd) {
          targetOpt = target[cmdKey][meta.cmd.key].options[meta.options.meta.option.name].value
        } else {
          targetOpt = target.options[meta.options.meta.option.name].value
        }
        if (meta.options.meta.argCount === 1) {
          targetOpt = argv
        } else {
          targetOpt[meta.options.meta.argCount - meta.options.handle] = argv
        }
        meta.options.handle--
        if (meta.options.handle < 1) {
          meta.cmd = false
        }
      }
      // if it's a command
      else if (reg.cmd.test(argv)) { 
        meta.cmd = {}
        meta.cmd.type = 'cmd'
        meta.cmd.key = argv
        // parsed[meta.process.key].cmd[meta.cmd.key].arg.push(argv)
        let cmd = {
          name: argv,
          options: {},
          arg: []
        }
        parsed.cmd.push(argv)
        if (typeof target.cmd === 'boolean') {
          target[cmdKey] = {}
        }
        target[cmdKey][argv] = cmd
        parsed[meta.process.key].hasCmd = true
        meta.cmdCount++
        target.cmdLength = meta.cmdCount
      }
      // If it's a option @exemple --deep or -d
      if (reg.option.normal.test(argv) || reg.option.shortcut.test(argv)) {
        let targetOpt
        if (meta.cmd) {
          console.log(cmdKey)
          targetOpt = target[cmdKey][meta.cmd.key]._options
          console.log(target)
        } else {
          targetOpt = target.options
        }
        meta.options = {}
        // console.log(target.loader._option)
        let opt = target.loader._options.get(argv)
        if (target.loader._options && opt) {
          meta.options = opt
          let option = {
            value: opt.value,
            key: opt.meta.option.call
          }
          targetOpt[opt.meta.option.name] = option
          if (opt.meta.value.type === 'boolean') {
            targetOpt[opt.meta.option.name].value = !opt.value
          }
          meta.options.handle = opt.meta.argCount
        } else {
          throw new Error('Io \'' + argv + '\' option is missing in ' + target.loader.name + ' configuration at location: ' + path.normalize(path.resolve(target.process, target.loader.ioFileName)))
        }
        // target.options.meta = meta.options
      }
      prev = {meta, data}
      index++
    }
    // console.log(parsed)
    if (typeof parsed.current !== 'undefined') {
      this.module = parsed.current.loader
      this.hasModule = true
    }
    console.log(parsed)
    return parsed
  }
  get parentCmd () {
    let cmd = []
    for (let child of this.argv.childs) {
      for (let ccmd in child.currentCmd) {
        cmd.push(ccmd)
        break
      }
    }
    return cmd
  }
  get argv () {
    if (!this._argv) {
      this._argv = this.parseArgv()
    }
    return this._argv
  }
  get modulePath () {
    // console.log(this.cmd)
    let url = this.argv.current.loader.modules.getUrl(this.cmd)
    if (url) {
      return this.pathToIoFile(url)
    } else {
      return false
    }
    // console.log(this.argv.current.process)
    // console.log(this.argv.current.loader.modules)
    // // this.argv.current.
    // if (/bin$/.test(path.dirname(this.argv.process[1].path))) {
    //   return path.resolve(path.dirname(this.argv.process[1].path), '../')
    // } else {
    //   return path.dirname(this.argv.process[1].path)
    // }
  }
  get inModule () {
    if (this.hasModule) {
      return this.module.modules[this.cmd] !== 'undefined'
    } else {
      return false
    }
  }
  isPathGlobal (pathTo) {
    let find = utils.escape(path.normalize(this.iorizonCliPathFolder)) + '$'
    pathTo = path.normalize(pathTo)
    let rep = new RegExp(find, 'i').test(pathTo)
    // console.log(rep)
    return rep
  }
  get currentPath () {
    return shell.pwd().stdout
  }
  get globalPathFolders () {
    return this.globalPath.split(path.sep).slice(0, this.ioFolderKey + 1)
  }
  set globalPath (val) {
    this._globalPath = val
  }
  get globalPath () {
    if (!this._globalPath) {
      this.globalPath = __dirname
    } 
    return this._globalPath
  }
  get ioFolderKey () {
    let IoFolderKey = 0
    for (let folder of this.globalPath.split(path.sep)) {
      if (folder === this.globalFolder) {
        break
      }
      IoFolderKey++
    }
    return IoFolderKey
  }
  pathToIoFile (pathTo) {
    let first = true
    // console.log(pathTo)
    pathTo = path.normalize(pathTo)
    let rootPath = path.normalize(path.parse(pathTo).root)
    let file
    let continu = true
    do {
      pathTo = path.normalize(pathTo)
      if (!first) {
        pathTo = path.resolve(pathTo, '../')
      } else {
        first = false
      }
      file = path.resolve(pathTo, this.ioFile)
      continu = !(fs.existsSync(file) || pathTo === rootPath)
      if (!continu && !fs.existsSync(file)) {
        pathTo = false
      }
    } while (continu)
    return pathTo
  }
  get globalPathFile () {
    let GlobalPath = this.globalPathFolders
    return path.normalize(path.join(...GlobalPath))
  }

  set globalPathFile (value) {
    console.warn("cannot set this path")
    return false
  }
}

module.exports = Io
