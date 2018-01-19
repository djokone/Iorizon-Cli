let { resolve, parse, normalize, join } = require('path')
var os = require('os')
const platform = os.platform()
let nodeModulesGlobal
console.log(platform === 'darwin')
if (platform === 'darwin') {
  nodeModulesGlobal = 'usr/local/lib/'
} else {
  nodeModulesGlobal = process.env.npm_config_prefix
}
console.log(normalize(join(nodeModulesGlobal, '/node_modules/iorizon-cli/bin/iorizon')))
let env = {
  ioCwd: {
    name: 'Iorizon-cli Folder Current Directory',
    path: resolve(__dirname, '../../')
  },
  nodeProcess: {
    name: 'node',
    path: process.argv0
  },
  ioProcess: {
    name: 'io',
    path: normalize(join(nodeModulesGlobal, '/node_modules/iorizon-cli/bin/iorizon'))
  },
  aliasProcess: {
    name: 'alias',
    path: normalize(join(nodeModulesGlobal, '/node_modules/iorizon-cli/bin/cmd/alias'))
  }
}

module.exports = env