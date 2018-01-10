let AliasLoader = require('../bin/lib/AliasLoader')
let ioTestConf = require('./ioTest.json')
var chai = require('chai')
var sinon = require('sinon')
var path = require('path')
let { resolve, parse, normalize } = path
let { existsSync } = require('fs')
var expect = chai.expect
var should = chai.should

let aliasLoader
describe('Alias Loader class', () => {
  let paths = {
    sites: "e:/sites",
    factory: normalize("e:/sites/myModules"),
    cakephp3: normalize("e:/sites/Cakephp3")
  }
  describe('#constructor ()', () => {
    aliasLoader = new AliasLoader(ioTestConf.alias)
    it('should have paths', () => {
      expect(aliasLoader.paths).is.deep.equal(paths)
    })
  })

  describe('#getPath(alias)', () => {
    let site = aliasLoader.getPath('sites')
    let factory = aliasLoader.getPath('factory')
    let cakephp3 = aliasLoader.getPath('cakephp3')
    it('should get the right alias path', () => {
      // let dontExist = aliasLoader.getPath('unknow')
      expect(site).equal(paths.sites)
      expect(factory).equal(paths.factory)
      expect(cakephp3).equal(paths.cakephp3)
      // expect(dontExist).to.be.false
    })
    // it('should call ')
  })  

  describe('#findAlias(alias, action())', () => {
    it('should find 2 alias', () => {
      let twiceAliases = aliasLoader.findAlias('@site/@cakephp3')
      // console.log(twiceAliases)
      expect(twiceAliases.alias.length).equal(2)
      expect(twiceAliases.alias[0].match).equal('@site')
      expect(twiceAliases.alias[0].name).equal('site')
      expect(twiceAliases.alias[1].match).equal('@cakephp3')
      expect(twiceAliases.alias[1].name).equal('cakephp3')
    })
    it('should call callback for each aliases', () => {
      let actionCb = sinon.spy()
      let twiceAliases = aliasLoader.findAlias('@site/@cakephp3', actionCb)
      actionCb.calledTwice
      // console.log(actionCb)
    })
  })
})

module.exports = {
  aliasLoader
}
