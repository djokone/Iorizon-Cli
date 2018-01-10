let { resolve, parse, normalize } = require('path')

let env = {
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

// Io Core Process Argv
// cmd: io alias
// current: io
let IoPA = [
  env.nodeProcess.path,
  env.ioProcess.path,
  '-g',
  // '-t',
  // 3,
  'alias'
]

// Alias Process Argv
// cmd: io alias
// current: alias
let APA = [
  env.nodeProcess.path,
  env.aliasProcess.path,
  'alias',
  env.ioProcess.path

]

let cmds = [
  {
    cmd: 'io -g alias',
    processes: [
      {
        current: 'io',
        argv: IoPA
      },
      {
        current: 'alias',
        argv: APA
      }
    ]
  }
]

module.exports = {
  env,
  cmds
}
