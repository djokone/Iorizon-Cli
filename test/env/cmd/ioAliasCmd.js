const env = require('../envMachine')

let ioAliasCmd = [
  {
    cmd: 'io alias -g',
    cwd: env.ioCwd,
    expected: {
      engine: {
        path: env.ioProcess.path
      }
    },
    subProcess: [ //  All process to make io alias -g cmd
      {
        current: 'io',
        argv: [
          env.nodeProcess.path,
          env.ioProcess.path,
          'alias',
          '-g'
        ],
        expected: {
          cmd: ['alias'],
          parents: {
            be: false
          },
          engine: {
            path: env.ioProcess.path
          },
          childs: {
            // be: 
            path: [env.aliasProces]
          }
        }
      },
      {
        current: 'alias',
        argv: [
          env.nodeProcess.path,
          env.aliasProcess.path,
          'alias',
          '-g',
          env.ioProcess.path
        ],
        expected: {
          options: {
            current: false,
            deep: 0,
            global: true,
            test: 0
          }
        }
      }
    ]
  }
]

module.exports = ioAliasCmd
