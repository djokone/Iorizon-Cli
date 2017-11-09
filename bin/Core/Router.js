const jq = require('node-jq') // to manipulate JSON
var shell = require("shelljs");
var Controller = require('./Controller.js');

module.exports = {
  program: require('commander'),
  controller: false,
  action: false,
  init: function () {
    let that = this
    this.program
      .arguments('<cmd> [env]')
      .action(function (cmd, env) {
        // console.log(cmd)
        // console.log(env)
        that.setController(cmd)
        that.setAction(env)
      })
    // console.log('iniiiit router')
    // console.log(this.controller)
    // console.log(this.action)
    // console.log('iniiiit router')
    Controller.init(this)
  },
  dispatchRequest () {

  },
  dispatchRoutes: function () {
    this.program
      .parse(process.argv)
    Controller.run()
  },
  connect: function (cmd, link) {
    this.program.command(cmd)
      .action() {

      }

  },
  setAction: function (action) {
    console.log(action)
    this.action = action
  },
  getController: function () {
    return this.controller
  },
  setController: function (controller) {
    console.log(controller)
    this.controller = controller
  }
}