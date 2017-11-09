var router = require('./Core/Router.js')

module.exports = {
  init: function () {
    router.init()
  },
  map: function () {
    router.connect('', {
      controller: 'app',
      action: 'smart'
    })
    router.connect('init', {
      controller: 'app'
    })
  },
  dispatch: function () {
    router.dispatchRoutes()
  }
}