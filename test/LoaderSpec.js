let Loader = require('../bin/lib/Loader.js')
var chai = require('chai')
var path = require('path')
var expect = chai.expect
var should = chai.should
let customLoader = new Loader('./test/ioTest.json')
let { forEach } = require('../bin/lib/utils')

describe('Loader class', function () {

  let PathLoader, ObjectLoader, NudeLoader, AbsPathLoader
  let loaders = {}

  describe('#constructor (toLoad = false, config = {})', function () {
    describe('Init with relative path', function () {
      PathLoader = new Loader('./test/ioTest.json')
      it('Should init corectly', function () {
        expect(PathLoader.ioFileName, 'Problem to get file from path').equal('ioTest.json')
        expect(PathLoader.type, 'Should have a relativePath type').equal('relativePath')
      })
      it('Should load the file', function () {
        expect(PathLoader.isFileLoaded).to.be.true
        expect(PathLoader.isLoaded).to.be.true
      })
      loaders['RelPath'] = {
        loader: PathLoader,
        it: 'Should work with relative path init'
      }
    })

    describe('Init with absolute path', function () {
      AbsPathLoader = new Loader(path.resolve(__dirname, 'ioTest.json'))
      it('Should init corectly', () => {
        expect(AbsPathLoader.type).equal('absolutePath')
      })
      it('Should load the file', () => {
        expect(AbsPathLoader.isLoaded).to.be.true
        expect(AbsPathLoader.isFileLoaded).to.be.true
      })
      loaders['AbsPath'] = {
        loader: AbsPathLoader,
        it: 'Should work with absolute path init'
      }
    })

    describe('Init with nothings', function () {

        // in the current directory of the processus
      let result = path.resolve(__dirname, '../') 
      
      NudeLoader = new Loader()
      it('Should init corectly', function () { 
        expect(NudeLoader.autoRun).to.be.true
      })
      it('Should find the default path file', function () {
        expect(NudeLoader.ioFileName).equal('io.json')
        expect(NudeLoader.defaultPath).equal(result)
      })
      it('Should load io.json in the current directory', function () {
        expect(NudeLoader.isFileLoaded).to.be.true
        expect(NudeLoader.isLoaded).to.be.true
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
      let data = {
        name: 'Iotest'
      }
      let ObjectLoader = new Loader(data)
      it('Should init corectly', function () {
        expect(ObjectLoader.isFileLoaded).to.be.false
        expect(ObjectLoader.type).equal('object')
      })
      it('Should load data', function () {
        expect(ObjectLoader.isLoaded).to.be.true
        expect(ObjectLoader.content).equal(data)
      })
      loaders['obj'] = {
        loader: ObjectLoader,
        it: 'Should work with data init'
      }
    })
  })
  describe('#set/get content(val)', () => {
    describe('set content with object', () => {
      forEach(loaders, (data, key) => {
        it(data.it, () => {
          let content = { 
            name: 'test' 
          }
          data.loader.content = content
          expect(data.loader._content).to.deep.equal(content)
          expect(data.loader.type).equal('object')
          expect(data.loader.isLoaded).to.be.true
        })
      })
    })
    describe('set content with relative path', () => {
      forEach(loaders, (data, key) => {
        it(data.it, () => {
          data.loader.content = { name: 'test' }
        })
      })
    })
  })

  describe.skip('# load (path, auto = true)', () => {
    
  })
})