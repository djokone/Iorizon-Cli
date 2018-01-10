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

let IoCoreConf = require('../io.json')

let nodeProcess = process.argv0
let ioProcess = normalize(resolve(process.env.npm_config_prefix, 'node_modules/iorizon-cli/bin/iorizon'))
let aliasProcess = normalize(resolve(process.env.npm_config_prefix, 'node_modules/iorizon-cli/bin/cmd/alias'))

describe('Io class', () => {
  let InitIoPA
  describe('Environement', () => {
    forEach(env, (v, k) => {
      it('Should have ' + v.name + ' path : ' + v.path, () => {
        expect(existsSync(v.path)).to.be.true
      })
    })
  })
  describe('#constructor ()', () => {
    describe('In the io process', () => {
      InitIoPA = new Io({
        argv: cmds[0].processes[0].argv
      })
      let IoCoreOptions = {
        deep: 0,
        test: 0,
        global: true,
        current: false
      }
      // console.log(InitIoPA)
      it('Should have a cmd propertie', function () {
        expect(InitIoPA.cmd).equal('alias')
      })

      it('Should parse argv', function () {
        expect(InitIoPA.argv.current.options.global).to.deep.equal({value: true, key: '-g'})
      })
      it('Should find Io path file', () => {
        // expect('')
      })
      it('Should init all the ioLoader', function () {
        expect(InitIoPA.global.isLoaded).to.be.true
        expect(InitIoPA.current.isLoaded).to.be.true
      })
      it('Should load right options', function () {
        expect(InitIoPA.options).to.deep.equal(IoCoreOptions)
      })
    })
  })

  // describe('Should find path to io file', () => {
  //   init
  //   it('Should')
  // })
})