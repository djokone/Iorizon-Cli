let Io = require('../bin/lib/Io')
let CP = require('child_process')
var chai = require('chai')
var path = require('path')
var expect = chai.expect
var should = chai.should

let IoCoreConf = require('../io.json')

// Io Core Windows Process Argv
let IoWPA = [
  'E:\\App\\nodeJs\\node.exe',
  'E:\\App\\nodeJs\\node_modules\\iorizon-cli\\bin\\iorizon',
  '-g',
  'alias',
]

// Alias Windows Process Argv
// cmd: io alias
// current: alias
let AWPA = [
  'E:\\App\\nodeJs\\node.exe',
  'E:\\App\\nodeJs\\node_modules\\iorizon-cli\\bin\\cmd\\alias',
  'alias',
  'E:\\App\\nodeJs\\node_modules\\iorizon-cli\\bin\\iorizon'
]

describe('Io class', () => {
  let InitIoAWPA
  describe('#constructor ()', () => {
    describe('In the io process', () => {
      InitIoWPA = new Io({
        argv: IoWPA
      })
      let IoCoreOptions = {
        deep: 0,
        test: 0,
        global: true,
        current: false
      }
      it('Should have a cmd propertie', function () {
        expect(InitIoWPA.cmd).equal('alias')
      })

      it('Should parse argv', function () {
        expect(InitIoWPA.argv.current.options.global).to.deep.equal({value: true, key: '-g'})
      })
      console.log(InitIoWPA.argv.current)
      // it('Should init all the ioLoader', function () {
      //   expect(Init)
      // })
      it('Should load right options', function () {
        expect(InitIoWPA.options).to.deep.equal(IoCoreOptions)
      })
    })
  })
})