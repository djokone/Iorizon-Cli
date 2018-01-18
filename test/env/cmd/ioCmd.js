const env = require('../envMachine')

// Io Core Process Argv
// cmd: io -g alias
// current: io
let IoPA = [
  env.nodeProcess.path,
  env.ioProcess.path,
  '-g',
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

let ioProcess = [
  {
    cmd: 'io -g alias',
    cwd: env.ioCwd,
    subProcess: [
      {
        current: 'io',
        argv: IoPA, //  Io Process Argv
        expected: {
          options: {
            current: false,
            deep: 0,
            global: true,
            test: 0
          }
        }
      },
      {
        current: 'alias',
        argv: APA //  Io Process Argv
      }
    ]
  }
]

module.exports = ioProcess
