module.exports = {
  alias: /(@[a-zA-Z0-9]+)/,
  url: /^(https?:\/\/)/,
  cmd: /^[a-z]*$/,
  option: {
    normal: /^--[a-z]{2,}/,
    shortcut: /^-[a-z]{1}/,
    stringParser: {
      array: /^\[(\'[a-zA-Z\-\_0-9]+\'\,?|[0-9]+\,?|false\,?|(true)\,?)*\]$/
    },
    value: {
      number: /[0-9]+/
    }
  },
  path: {
    absolute: /^(([a-zA-Z]):)?(([\\]{1,2}|[\/])[a-zA-Z_-]*)*/,
    relative: /^.\//
  }
}