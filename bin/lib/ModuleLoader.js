var Loader = require('./Loader');
var {spawn} = require('child_process');
var clone = require('lodash/clone');
var OptionsLoader = require('./OptionsLoader')
var path = require('path');
var fs = require('fs')

class ModuleLoader extends Loader {
  constructor (ioConfModule, alias) {
    super(ioConfModule)
    this.argv = false
    this.relativeReg = /^.\//
    this.alias = alias
    this.isLoaded = true
  }
  has (name) {
    return typeof this.content[name] !== 'undefined'
  }
  hasConfFile (module) {
    if (this.hasUrl(module)) {
      return fs.existsSync(this.getUrl(module))
    } else {
      return false
    }
  }
  getModuleOptions (name) {
    let res = {}
    if (this.has(name)) {
      let opt = new OptionsLoader (this.content[name])
      opt.each((v, k) => {
        let o = opt.get(v)
        res[o.meta.option.name] = o.value
      })
    }
    return res
  }
  getUrl(module, rootPath = process.cwd()) {
    // console.log(rootPath)
    let url = false
    if (this.has(module)) {
      url = this.alias.parseUrl(this.content[module].url)
    }
    
    // console.log(this.argv)
    if (this.relativeReg.test(url)) {
      url = path.resolve(rootPath, url)
    }
    return url
  }
  hasUrl(module) {
    return typeof this.content[module].url !== 'undefined'
  }

  buildRequest (argv) {
    let processus = []
    // console.log(argv)
    if (typeof argv.current !== 'undefined') {
      let currentProcess = this.buildProcess(argv.current, true)
      // console.log(currentProcess)
      processus.push(...currentProcess)
    }
    return processus
  }
  buildOptions (optToBuild) {
    let res = []
    for (let option in optToBuild) {
      let opt = optToBuild[option]
      res.push(opt.key)
      if (Array.isArray(opt.value)) {
          res.push(...opt.value)
      } else if (typeof opt.value !== 'boolean') {
        res.push(opt.value)
      }
    } return res
  }
  buildCmd (cmdToBuild) {
    let res = []
    for (let command in cmdToBuild) {
      let cmd = cmdToBuild[command]
      res.push(command)
      // console.log(cmd)
      res.push(...this.buildOptions(cmd.options))
    }
    return res
  }
  buildProcess (processus, current = false) {
    let res = []
    if (!current) {
      res.push(processus.process)
    }
    res.push(...this.buildCmd(processus.cmd))
    if (current) {
      res.push(processus.process)
    }
    res.push(...this.buildCmd(processus.currentCmd))
    res.push(...this.buildOptions(processus.options))
    // console.log(res)
    return res
  }
  run (name, argv, mode = 'spawn') {
    let globalOptions = []
    // console.log(argv)
    let childParams = this.buildRequest(argv)
    // console.log(childParams)
    // let childParams = clone(this.argv.all)
    // childParams.splice(this.argv.process.all.length - 1, 0, ...globalOptions)
    // console.log(childParams)
    let fileToRun = false
    if (this.has(name) && this.hasUrl(name)) {
      fileToRun = this.getUrl(name, argv.current.url)
    } else {
      return false
      console.error('Your ' + name + ' module has no url params !')
    }
    if (fileToRun) {
      let child = false
      if (mode === 'spawn') {
        let child = spawn('node ' + fileToRun, childParams, { stdio: 'inherit', shell: true })
      } else if (mode === 'spawnSync'){
        let child = spawn.sync(fileToRun, childParams, { stdio: 'inherit' })
      }
      if (child) {
        child.on('error', (err) => {
          console.error(err)
          console.error(err)
        })
        child.on('data', (data) => {
          console.log(data)
        })
      }
    }
    
  }
}

module.exports = ModuleLoader
