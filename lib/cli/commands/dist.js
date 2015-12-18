'use strict'
var fs = require('vigour-fs-promised')
var path = require('path')
var log = require('npmlog')
var promisify = require('bluebird').promisify
var glob = promisify(require('multi-glob').glob)
var rimraf = promisify(require('rimraf'))
var backtrackFile = require('../../utils/backtrack-file')
var pkgPath = backtrackFile('package.json', process.cwd())
var pkg = require(pkgPath)
var basePath = path.dirname(pkgPath)
var distPath = path.join(basePath, 'dist')

module.exports = function dist (args) {
  var distOptions = pkg.gaston && pkg.gaston.dist
  if (!distOptions) {
    throw Error('no dist options in gaston section of package.json')
  }

  return rimraf(distPath)
    .then(function () {
      var arr = []
      if (distOptions.files) {
        arr.push({
          platform: 'web',
          root: path.join(basePath, distOptions.root || '.'),
          files: distOptions.files,
          appcache: distOptions.appcache
        })
      } else {
        for (var platform in distOptions) {
          arr.push({
            platform: platform,
            root: path.join(basePath, distOptions[platform].root),
            files: distOptions[platform].files,
            appcache: distOptions[platform].appcache
          })
        }
      }
      return Promise.all(arr.map(function (item) {
        return glob(item.files, { cwd: item.root })
          .then(function (files) {
            var l = files.length
            var copies = []
            for (var i = 0; i < l; i += 1) {
              var file = files[i]
              copies.push(fs.cpAsync(path.join(item.root, file),
                  path.join(distPath, item.platform, file),
                { mkdirp: true }))
            }
            return Promise.all(copies)
              .then(function (copyPromises) {
                if (item.appcache) {
                  return handleAppCacheManifest(item.platform, item.root, files)
                }
              })
          })
      }))
    })
    .then(function () {
      log.info('gaston', 'dist done')
    })
}

var handleAppCacheManifest = function (platform, root, files) {
  var gastonFilesPath = path.join(__dirname, '../../../gaston-files')
  var buildHtmlPath = path.join(distPath, platform, 'build.html')
  return fs.readFileAsync(path.join(gastonFilesPath, 'application.appcache'), 'utf8')
    .then((data) => {
      data = data.replace('{version}', 'v' + pkg.version)
      data = data.replace('{cached-files}', files.join('\n'))
      return fs.writeFileAsync(path.join(distPath, platform, pkg.name + '.appcache'), data, 'utf8')
    })
    .then(() => fs.readFileAsync(buildHtmlPath, 'utf8'))
    .then((data) => data = data.replace('<html', `<html manifest="${pkg.name}.appcache"`))
    .then((data) => fs.writeFileAsync(buildHtmlPath, data, 'utf8'))
}
