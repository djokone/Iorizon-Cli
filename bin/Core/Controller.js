var conf = require('./DefaultConf')

module.exports = {
  Router: false,
  Conf: {},
  Controller: false,
  Error: require('./ErrorMiddleware'),
  View: false,
  init: function (Router) {
    this.Router = Router
    this.setConf(conf)
  },
  run: function () {
    try {
      this.Controller = require('../' + conf.controller + '/' + this.Router.controller)
    } catch (e) {
      this.Error(e)
    }
    this._setDefaultView()
    console.log(this.Router)
    // this.controller[this.Router.action]()
    this.render()
  },
  _setDefaultView () {
    console.log('setDefaultView')
  },
  render: function () {
  },
  setConf: function (conf) {
    this.Conf = conf
  }
}