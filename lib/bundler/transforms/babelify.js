var path = require('path')
var babelify = require('babelify')
var supportedPresets = ['es2015', 'react']

module.exports = function(config){
  config.gaston = config.gaston || {}
  var presets = (config.gaston.babel && config.gaston.babel.presets) || []
  if(!~presets.indexOf('es2015')){
    presets.push('es2015')
  }

  var nodeModulesPath = path.join(__dirname, '../../..', 'node_modules')
  if(!fs.existsSync(nodeModulesPath)){
    nodeModulesPath = path.join(config.project['base-path'], 'node_modules')
  }

  presets = presets
    .map((preset) => {
      preset = preset.replace('babel-preset-', '')
      if(~supportedPresets.indexOf(preset)){
        return path.join(nodeModulesPath, 'babel-preset-' + preset)
      } else {
        return preset
      }
    })

  var plugins = ['transform-es2015-block-scoping']
  plugins = plugins.map(plugin => path.join(nodeModulesPath, 'babel-plugin-' + plugin))

  return babelify.configure({presets, plugins})
}
