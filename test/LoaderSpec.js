let Loader = require('../bin/lib/Loader.js')
var chai = require('chai')
var expect = chai.expect
var should = chai.should
let customLoader = new Loader('./test/ioTest.json')
describe('Loader class', function () {
  describe('#constructor (toLoad = false, config = {})', function () {
    let PathLoader, ObjectLoader, NudeLoader
    describe('Init with relative path', function () {
      PathLoader = new Loader('./test/ioTest.json')
      it('Should instantiate with the right properties', function () {
        expect(PathLoader.ioFileName, 'Problem to get file from path').equal('ioTest.json')
        expect(PathLoader.type, 'Should have a relativePath type').equal('relativePath')
      })
      it('Should load the file', function () {
        expect(PathLoader.type, 'Should have a relativePath type').equal('relativePath')
        expect(PathLoader.isFileLoaded).to.be.true
      })
    })
    describe('Init with nothings', function () {
      NudeLoader = new Loader()
      it('Should find a path', function () {
        
      })
    })

    describe('Init with config', function () {
      let ConfLoader = new Loader('./test/ioTest.json', {
        allowedExt: ['yaml'],
        ioFileName: 'newIo.json'
      })
      it('Should replace io file name propertie', function () {
        expect(ConfLoader.ioFileName).equal('newIo.json')
      })
      it.skip('Should add a new allowed Ext', function () {
        expect(ConfLoader.allowedExt.length).equal(2)
      })
    })

    describe('Init with object', function () {
      let ObjectLoader = new Loader({name: 'Iotest'})
      it('Should ', function () {
        expect(ObjectLoader.isFileLoaded).to.be.false
      })
      
    })
    
  })
  describe.skip('# set content(val)', () => {
  })
})