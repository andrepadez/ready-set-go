var path = require('path')
var minimist = require('minimist')
var args = minimist(process.argv.slice(2))

if (args.v || args.version) {
  process.exit(0)
}

var log = require('npmlog')
var fs = require('promfs')

var commandsPath = path.join(__dirname, 'commands')

var command

var Config = global.Config = require('../config')

var cmd = args._[0]
var cmdPath = path.join(commandsPath, cmd + '.js')

fs.existsAsync(cmdPath)
  .then(function (exists) {
    if (!exists) {
      log.error('gaston', 'command', cmd, 'not supported')
      log.info('gaston', "run 'gaston help' for help")
      process.exit(1)
    }
  })
  .then(Config.init)
  .then(function (socket) {
    command = require(cmdPath)
    return command(args)
  })
  .then(function (code) {
    if (cmd !== 'start') {
      process.exit(code || 0)
    }
  })
  .catch(function (err) {
    if (err && err.description && err.description === 503) {
      log.error('gaston', 'daemon not running')
    } else {
      log.error('gaston', err)
    }
    process.exit(1)
  })
