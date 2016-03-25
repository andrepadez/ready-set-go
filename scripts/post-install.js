#!/usr/bin/env node
var path = require('path')
var fs = require('promfs')
var homedir = process.env.USERPROFILE || process.env.HOME
var configPath = path.join(homedir, '.gaston', 'config.json')
var initialConfig = {
  'http-port': 8080,
  'api-port': 64571,
  'base-path': homedir,
  'source-maps': true,
  'index-path': false,
  'css-compiler': 'less',
  'babel': {
    'presets': ['react']
  }
}

fs.existsAsync(configPath)
  .then(function (exists) {
    if (!exists) {
      fs.mkdirp(path.dirname(configPath))
        .then(fs.writeFileAsync(configPath, JSON.stringify(initialConfig, null, 2)))
    }
  })
