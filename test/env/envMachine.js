let { resolve, parse, normalize } = require('path')

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
    path: normalize(resolve(process.env.npm_config_prefix, 'node_modules/iorizon-cli/bin/iorizon'))
  },
  aliasProcess: {
    name: 'alias',
    path: normalize(resolve(process.env.npm_config_prefix, 'node_modules/iorizon-cli/bin/cmd/alias'))
  }
}

module.exports = env