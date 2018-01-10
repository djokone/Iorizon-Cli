let ModuleLoader = require('../bin/lib/ModuleLoader')
let AliasLoader = require('./AliasLoaderSpec').aliasLoader
let ioTestConf = require('./ioTest.json')

let CP = require('child_process')
var chai = require('chai')
var sinon = require('sinon')
var path = require('path')
let { resolve, parse, normalize } = path
let { existsSync } = require('fs')
var expect = chai.expect
var should = chai.should

let moduleLoader
describe('Module Loader Class', () => {
  describe('#constructor(ioConfModule, alias)', () => {
    moduleLoader = new ModuleLoader(ioTestConf.modules, AliasLoader)
    it('Should init correctly', () => {
      expect(moduleLoader.isLoaded).to.be.true
      expect(moduleLoader.alias.isLoaded).to.be.true
    })
    it('Should browse each modules with each()', () => {
      let spy = sinon.spy()
      moduleLoader.each(spy)
      expect(spy.getCalls().length).equal(3)
    })
  })
  describe('#has(name)', () => {
    it('Should check if it has the module required', () => {
      let hasInit = moduleLoader.has('init')
      let unknow = moduleLoader.has('unknow')
      expect(hasInit).to.be.true
      expect(unknow).to.be.false
    })
  })
})