var Loader = require('./Loader')
var reg = require('./ioRegex')
var utils = require('./utils')

class OptionsLoader extends Loader {
  constructor (ioConfOptions) {
    super(ioConfOptions)
  }
  /**
   * Parse Option Called trought the ioConfig
   * @param  {[type]} optionArg [description]
   * @return {[type]}           [description]
   */
  parseOption (optionKey) {
    let name
    let shortcut = false
    let call = optionKey
    if (typeof this.content[optionKey] === 'undefined') {
      this.each((v, k) => {
        if (new RegExp(optionKey, 'i').test(v)) {
          shortcut = optionKey
          optionKey = v
        }
      })
    }
    if (/\|/.test(optionKey)) {
      let options = optionKey.split('|')
      for (let option of options) {
        if (reg.option.normal.test(option)) {
          name = option.replace(/\-\-/, '')
        }
        if (reg.option.shortcut.test(option)) {
          shortcut = { name: option.replace(/\-/, ''), key: optionKey}
        }
      }
    } else {
      name = optionKey.replace(/\-\-/, '')
    }
    return {
      key: optionKey,
      name,
      shortcut,
      call
    }
  }
  /**
   * Parse Option Value In Configuration file
   * @param  {[Array|Object|String|Number]}  value - Value to parse
   * @param  {Boolean} isRoot If it's call form inside
   * @return {Object} exemple : { meta: { type: 'number', reg: /[0-9]+/, value: 0 }
   */
  parseOptionValue (value, isRoot = true) {
    let res = {
      meta: {}
    }
    if (isRoot)
      res.argCount = 1
    if (Array.isArray(value)) {
      res.argCount = value.length
      res.meta = {}
      if (res.argCount > 1) {
        res.meta = []
      }
      res.value = []
      for (let v of value) {
        let parentRes = this.parseOptionValue(v, false)
        if (res.argCount === 1) {
          res.value = parentRes.value
          res.meta = parentRes.meta
        } else {
          res.meta.push(parentRes.meta)
          res.value.push(parentRes.value)
        }
      }
    }
    if (typeof value === 'string') {
      // here to add some new option custom type
      if (typeof reg.option.value[value.toLowerCase()] !== 'undefined') {
        value = value.toLowerCase()
        res.meta.type = value
        res.meta.reg = reg.option.value[value]
        if (value === 'number') {
          res.value = res.meta.value = 0
        }
      } else if (value.toLowerCase() === 'array') {
        res.meta.type = value.toLowerCase()
        res.value = res.meta.value = []
      } else if (value.toLowerCase() === 'boolean') {
        res.meta.type = value.toLowerCase()
        res.value = res.meta.value = false
      } else if (value.toLowerCase() === 'object') {
        res.meta.type = value.toLowerCase()
        res.value = res.meta.value = {}
      }
      else {
        // @todo : parse function for array and object
        res.meta.type = 'String'
        res.value = res.meta.value = value
      }
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      res.meta.type = typeof value
      res.value = value
    }
    if (res.meta.type === 'boolean' && res.argCount === 1) {
      res.argCount = 0
    }
    return res
  }
  getOption () {
  }
  get (name) {
    let res = {
      meta: {}
    }
    res.meta.option = this.parseOption(name)
    res.key = res.meta.option.key
    // console.log(this.content[res.key])
    if (typeof this.content[res.key] !== 'undefined') {
      let optionValue = this.parseOptionValue(this.content[res.key])
      res.meta.argCount = optionValue.argCount
      res.value = optionValue.value
      res.meta.value = optionValue.meta
    } else {
      return false
    }
    return res
  }
}

module.exports = OptionsLoader