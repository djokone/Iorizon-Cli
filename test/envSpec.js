var chai = require('chai')
let { env } = require('./env/process')
var expect = chai.expect 
var should = chai.should 

let { forEach } = require('../bin/lib/utils')
let { existsSync } = require('fs') 

describe('Environement', () => {
  forEach(env, (v, k) => {
    it('Should have ' + v.name + ' path : ' + v.path, () => { 
      expect(existsSync(v.path)).to.be.true 
    }) 
  })
})