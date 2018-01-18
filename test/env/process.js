const env = require('./envMachine')

const ioOptCmd = require('./cmd/ioCmd.js')
const ioAliasOptCmd = require('./cmd/ioAliasCmd.js')

let cmds = [
  ...ioOptCmd,
  ...ioAliasOptCmd
]

module.exports = {
  env,
  cmds
}
