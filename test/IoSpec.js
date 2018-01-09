let Io = require('../bin/lib/Io')
let CP = require('child_process')
var chai = require('chai')
var path = require('path')
var expect = chai.expect
var should = chai.should

// test alias command
let alias = {}

console.log(ioAlias.process)
describe('Io class', () => {
  let ioAliasInit
  describe('#constructor ()', () => {
    ioAliasInit = new Io({argv: ioAlias})
    // console.log(ioAliasInit)
  })
})