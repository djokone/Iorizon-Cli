var IoLoader = require('./IoLoader')
var path = require('path');
var fs = require('fs');
var utils = require('./utils');
var shell = require("shelljs");
const reg = require('./ioRegex')
let debug = require('../lib/debugger').debug


class Io {
  constructor (config = {}, digest = false) {
    this.initProperties()
    if (!digest) {
      this.init()
    }
  }
  initProperties (config = {}) {
    this._process = false
    this._current = false
    if (config.process) {
      this._process = config.process
    }
    this.globalFolder = 'iorizon-cli'
    this.enginePath = 'iorizon-cli/bin/iorizon'
    this.enginePath = 'iorizon-cli/bin/iorizon'
    this.ioFile = 'io.json'
    this.commandPriority = ['current', 'global']
    this._enginePath = false
    this._argv = false
    if (config.argv) {
      if (this._process === false) {
        this._process = process
      }
      this._process.argv = config.argv
    }
    this.isInit = false
  }

  /**
   * Require proxy to use alias shortcut in require function. 
   * Juste run the function to active the proxy.
   * @todo All to do
   */
  ioRequire () {
    // debug('io Require')
    require = new Proxy (require, {
      apply: function (target, thisArg, argument) {
        debug(target)
        debug(thisArg)
        debug(argument)
      }
    })
  }

  /**
   * Get the engine used for your command line tool, will be the parent process. If you want to
   * to create you're own follow the contribution guide
   * @return {[type]} [description]
   */
  get engine () {
    // debug(this.modulePath)
    if (!this._engine) {
      this._engine = new IoLoader(this.pathToIoFile(this.globalPathFile))
    }
    if (this.inModule && this.modulePath) {
      this.module = this.argv.current.loader
      // this.module.argv = this.argv
      this.hasModule = true
    }  else {
      this.hasModule = false
    }
    console.log(this._engine)
    return this._engine
  }

  /**
   * Get the global path file
   * @return {String} Global io path file
   */
  get globalPathFile () {
    let GlobalPath = this.globalPathFolders
    return path.normalize(path.join(...GlobalPath))
  }

  set globalPathFile (value) {
    console.warn("cannot set this path")
    return false
  }
  get cmd () {
    if (typeof this.argv.current !== 'undefined' && Array.isArray(this.argv.current.cmd)) {
      debug(this.argv)
      for (let cmd in this.argv.current.cmd) {
        return cmd
        break
      }
      return false
    } else if (Array.isArray(this.argv.cmd)) {
      // debug(this.argv.cmd)
      for (let cmd of this.argv.cmd) {
        return cmd
        break
      }
      return false
    }
  }
  init () {
    this.isInit = true
  }
  get current () {
    if (this._current === false) {
      this._current = new IoLoader()
    }
    return this._current
  }
  get hasCurrentModules () {
    return typeof this.current.content.modules !== "undefined"
  }

  get process () {
    if (this._process === false) {
      return process
    } else {
      return this._process
    }
  }

  get processArgv () {
    if (this.process.argv) {
      return this.process.argv
    } else {
      false
    }
  }

  get module () {
    let modules = {}

    return modules
  }

  get options () {
    let res = this._syncOptions()
    if (this.hasModule && this.current.isLoaded) {
      let currentRes = this.current.modules.getModuleOptions(this.parentCmd[0])
      // debug(currentRes)
      res = Object.assign({}, res, currentRes)
    }
    return res
  }
  //sync current options
  _syncOptions () {
    let res = {}
    let current = this.argv.current
    current.loader._options.each((v, k) => {
      let opt = current.loader._options.get(v)
      res[opt.meta.option.name] = opt.value
    })
    for (let option in current.options) {
      let opt = current.options[option]
      res[option] = opt.value
    }
    return res
  }
  addOptions (key, value) {
    // debug(this.argv.current)
  }
  /**
   * Run the current sub command
   */
  runSubCommand () {
    if (this.isInit) {
      // debug(this.cmd)
      if (this.cmd) {
        // debug(this.current.modules.has(this.cmd))
        // debug(this)
        // debug(this.hasModule)
        if ((this.hasModule) && this.inModule && this.module.isLoaded && this.module.modules.has(this.cmd)) {
          this.module.modules.run(this.cmd, this.argv)
        } else if (this.hasCurrentModules && this.current.isLoaded && this.current.modules.has(this.cmd)) {
          this.current.modules.run(this.cmd, this.argv)
        } else if (this.engine.isLoaded && this.engine.modules.has(this.cmd)) {
          this.engine.modules.run(this.cmd, this.argv)
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
  parseArgv (argvs = this.process.argv) {
    let parsed = {}
    parsed.process = []
    // console.log(argvs)
    if (!Array.isArray(argvs)) {
      throw new Error('Argvs argument need to be an array !')
    }
    // reg.path.absolute.test(argvs[2]) ? parsed.process.io = argvs[2] : parsed.process.io = argvs[1]
    parsed.process.all = argvs.slice(1)
    parsed.process.argvs = argvs
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
    for (let argv of parsed.process.all) {
      debug(argv)
      debug('before')
      debug(meta)
      meta.current.argv = argv
      meta.current.index = index
      let data = {}
      // If it is a path, so it's a process
      if (path.isAbsolute(argv)) {
        meta.options = {}
        meta.cmd = false
        meta.process = {}
        meta.cmdProcessCount = 0
        meta.current.process++
        let ioPath = this.pathToIoFile(argv)
        meta.current.ioPath = ioPath
        let loader = false
        if (index === 1) {
          ioPath = this.pathToIoFile(this.process.mainModule.filename)
        }
        if (ioPath !== false) {
          loader = new IoLoader(ioPath)
        }
        data = {
          process: argv,
          loader,
          cmd: false,
          options: {},
          cmdLength: meta.cmdProcessCount,
          hasCmd: false
        }
        meta.process.engine = false
        if (this.isEngineProcess(argv)) {
          meta.process.engine = true
          meta.process.type = 'process'
          meta.current.type = 'process'
          meta.process.value = argv
          meta.process.key = 'engine'
          parsed.engine = data
          parsed.engine.options = {}
        }
        if (index === 1) {
          meta.process.key = 'current'
          parsed.current = data
          parsed.childs = []
        } else if (index > 1) {
          meta.process.key = 'childs'
          parsed.childs.push(data)
          meta.process.indexKey = parsed.childs.length - 1
        }

      }
      let hasOptionsHandled = typeof meta.options !== 'undefined' && 
        typeof meta.options.handle !== 'undefined' && 
        meta.options.handle > 0
      let cmdKey = 'cmd'

      if (!hasOptionsHandled && reg.cmd.test(argv)) {
        meta.cmdProcessCount++
        // if (meta.cmdProcessCount === 1 && !meta.process.engine) {
        //   cmdKey = 'currentCmd'
        // }
      }
      let target
      // Handle the reference to manipulate it in next conditions
      if (meta.process.engine) {
        target = parsed.engine
      } else if (meta.process.key === 'childs') {
        target = parsed[meta.process.key][meta.process.indexKey]
      } else {
        target = parsed[meta.process.key]
      }

      // if it's a options value
      if (hasOptionsHandled) {
        meta.current.type = 'optVal'
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
      // if it's a command to handle
      else if (reg.cmd.test(argv)) { 
        meta.cmd = {}
        meta.current.type = 'cmd'
        meta.cmd.type = 'cmd'
        meta.cmd.key = argv
        // parsed[meta.process.key].cmd[meta.cmd.key].arg.push(argv)
        let cmd = {
          name: argv,
          options: {},
          arg: []
        }
        parsed.cmd.push(argv)
        // debug(cmdKey)
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
        // debug(meta)
        meta.current.type = 'opt'
        let targetOpt
        if (meta.cmd) {
          targetOpt = target[cmdKey][meta.cmd.key].options
        } else {
          targetOpt = target.options
        }
        meta.options = {}
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
      }
      prev = {meta, data}
      index++
    }
    debug(parsed)
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
  set argv (val) {
    if (Array.isArray(val)) {
      this._processArgv = val
      this._argv = this.parseArgv(val)
    } else {
      this._argv = val
    }
    
  }

  /**
   * Get Argv and parse argv if it's the first argv is called
   * @return {[type]} [description]
   */
  get argv () {
    if (!this._argv) {
      this._argv = this.parseArgv()
    }
    return this._argv
  }
  get modulePath () {
    // debug(this.cmd)
    let url = this.argv.current.loader.modules.getUrl(this.cmd)
    if (url) {
      return this.pathToIoFile(url)
    } else {
      return false
    }
    // debug(this.argv.current.process)
    // debug(this.argv.current.loader.modules)
    // // this.argv.current.
    // if (/bin$/.test(path.dirname(this.argv.process[1].path))) {
    //   return path.resolve(path.dirname(this.argv.process[1].path), '../')
    // } else {
    //   return path.dirname(this.argv.process[1].path)
    // }
  }

  /**
   * Check if the class has been initialize into a module
   * @return {Boolean} [description]
   */
  get inModule () {
    // debug(this.hasModule )
    if (this.hasModule && this.module) {
      return this.module.modules[this.cmd] !== 'undefined'
    } else {
      return false
    }
  }

  /**
   * Test if a specifique path is come from the engine
   * @param  {String}  pathTo Path you want to check
   * @return {Boolean}        Return true if the path come from 
   *                          the engine
   */
  isEngineProcess (pathTo) {
    let find = utils.escape(path.normalize(this.enginePath)) + '$'
    pathTo = path.normalize(pathTo)
    let rep = new RegExp(find, 'i').test(pathTo)
    // debug(rep)
    return rep
  }

  /**
   * Get the path directory where the current command is run
   * @return {String} Current Path Directory
   */
  get currentPath () {
    return shell.pwd().stdout
  }
   /**
   * Get an array of all the global path folder
   * @return {[Array]} Array with all the folder names
   */
  get globalPathFolders () {
    return this.globalPath.split(path.sep).slice(0, this.ioFolderKey + 1)
  }

  /**
   * Set the global path
   * @param  {[type]} val [description]
   * @return {[type]}     [description]
   */
  set globalPath (val) {
    this._enginePath = val
  }

  /**
   * Get global path
   * @return {String} return engine global path 
   */
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

  /**
   * Get the path to a Io root file from a given folder. 
   * This function will search in all the parents folder
   * to return the first file it find.
   * 
   * @param  {[type]} pathTo The path where you want to start the research
   * @return {Boolean}        return true if a root file's founded
   */
  pathToIoFile (pathTo) {
    let first = true
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
}

module.exports = Io
