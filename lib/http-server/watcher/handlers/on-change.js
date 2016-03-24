"use strict";

var path = require('path')
var dirname = path.dirname
var backtrackFile = require('../../../utils/backtrack-file')

module.exports = function onChange (Watcher) {
  return function onChange (file) {
    var Config = global.Config
    var projectPath = dirname(backtrackFile('package.json', dirname(file)))
    var project = Config.projects[projectPath]
    if (~file.indexOf('package.json')) {
      // var appKeys = Object.keys(Config.apps)
      // for (let i = 0, l = appKeys.length; i < l; i++) {
      //   let appKey = appKeys[i]
      //   let app = Config.apps[appKey]
      //   if (app && app.project === project) {
      //     Config.apps[appKey] = null
      //   }
      // }
      // return project.update()
      //   .then(function (project) {
      //     if (!Config.noLiveReload) {
      //       var io = require('../../../daemon').io
      //       io.emit('reload')
      //     }
      //   })
    } else {
      if (project && project.reloading) {
        return
      }
      if (project) {
        project.reloading = true
        setTimeout(() => project.reloading = false, 500)
      }
      if (!Config.noLiveReload) {
        var io = require('../../../daemon').io
        io.emit('reload')
      }
    }
  }
}
