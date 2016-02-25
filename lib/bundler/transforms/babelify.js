var path = require('path')
var babelify = require('babelify')
var supportedPresets = ['es2015', 'react']
var gastonModulesPath = path.join(__dirname, '../../..', 'node_modules')

module.exports = function(config){
  var presets = (config.gaston.babel && config.gaston.babel.presets) || []
  if(!~presets.indexOf('es2015')){
    presets.push('es2015')
  }

  presets = presets
    .map((preset) => {
      preset = preset.replace('babel-preset-', '')
      if(~supportedPresets.indexOf(preset)){
        return path.join(gastonModulesPath, 'babel-preset-' + preset)
      } else {
        return preset
      }
    })

  return babelify.configure({presets})
}
