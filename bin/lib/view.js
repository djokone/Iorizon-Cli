var Table = require('cli-table-redemption')
// var log = require('./debugger')

class view {
  constructor (options= {}, theme = 'lineArray', builder = 'tableRedemption') {
    this._data
    this._options = options
    this._view = {}
    this.builder = builder
    this.theme = theme
    this.init()
    return this.view
  }
  get view () {
    return this._view
  }
  get builder () {
    return this._builder
  }
  set builder (val) {
    this._builder = val
    if (typeof this[val] === 'function') {
      this[val]()
    }
  }
  init () {
    this[this.builder + 'Init']()
  }
  get themes () {
    return this[this.builder + 'Theme']()
  }
  get theme () {
    return this._options
  }
  set theme (val) {
    this._theme = val
    if (typeof this[this.builder + 'Theme'] === 'function') {
      this._options = Object.assign({}, this[this.builder + 'Theme'](val), this._options)
      // console.log(this[this.builder + 'Theme'](val), this._options))
    }
  }
  tableRedemptionTheme (name) {
    try {
      let theme = require('./Templates/Templates')[name]
      return theme
    } catch(e) {
      // statements
      console.log(e);
    }
  }
  tableRedemptionInit () {
    this._view = new Table(this._options)
  }
}

module.exports = view