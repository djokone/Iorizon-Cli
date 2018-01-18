let Io = require('../bin/lib/Io') 
let CP = require('child_process') 
var chai = require('chai') 
var path = require('path') 
let { resolve, parse, normalize } = path 
let { existsSync } = require('fs') 
var expect = chai.expect 
var should = chai.should
let { env, cmds } = require('./env/process')
let { forEach } = require('../bin/lib/utils')
let debug = require('../bin/lib/debugger').debug

let IoCoreConf = require('../io.json') 

describe('Io class', () => {
  let InitIoPA 
  let allCmdInit = []
  describe('#constructor ()', () => {
    // debug(cmds)
    // Each cmd argv run a processus
    forEach(cmds, (processus) => {
      let desc = 'During "' + processus.cmd + '" cmd'
      if (processus.cwd) {
        desc += ' in ' + processus.cwd.path + ' current directory.'
      }
      // debug(processus.cmd)
      describe(desc, () => {
        // Each processus got's 
        // debug(processus.subProcess)
        forEach(processus.subProcess, (sp, index) => {
          // debug(index)
          describe('In ' + sp.current + ' subprocess',() => {
            // debug(sp.argv)
            let initSp
            beforeEach(() => {
              let options = { argv: sp.argv }
              if (processus.cwd)
                options.cwd = processus.cwd.path
              initSp = new Io(options)
            })
            if (index !== 0) {
              it('Should have ' + sp.current + ' cmd', function () {
                expect(initSp.cmd).equal(sp.current)
              })
            }
            // debug(initSp.processArgv)
            it('Should have right argvs', function () {
              expect(initSp.processArgv).equal(sp.argv)
            })
            // if (sp.childs) {
            //   it('Should have childs process', () => {
            //     expect(sp.childs)
            //   })
            // }
            it('Should load current directory io.json', function () {
              expect(initSp.global.isLoaded).to.be.true 
              if (processus.cwd) {
                expect(initSp.current.url, 'Wrong current url').equal(processus.cwd.path)
                // expect(init.cmd)
              }
              // expect(initSp.current)
            })
            it('Should load the engine process', function () {
              expect(initSp.engine, 'Need to create the engine property in Io class').to.not.be.undefined
              expect(initSp.engine.isLoaded).to.be.true
            }) 
            it('Should init all the ioLoader', function () {
              expect(initSp.current, 'Don\'t have current directory loader').to.not.be.false
              expect(initSp.current.isLoaded).to.be.true 
            }) 
            if (sp.expected && sp.expected.options) {
              it('Should have the right options', function () {
                expect(initSp.options).to.deep.equal(sp.expected.options) 
              }) 
            }
          })
        })
      })
    })
    describe('In the io process', () => { 
      InitIoPA = new Io({ 
        argv: cmds[0].subProcess[0].argv 
      }) 
      let IoCoreOptions = { 
        deep: 0, 
        test: 0, 
        global: true, 
        current: false 
      } 
    }) 
  }) 
  describe('#parseArgv()', () => {
    let init = new Io({
      argv: cmds[0].subProcess[0].argv 
    })
    // it('Should ')
  })
  // describe('Should find path to io file', () => { 
  //   init 
  //   it('Should') 
  // }) 
})