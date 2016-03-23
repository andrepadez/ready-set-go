module.exports = function(req, res, next){
  if(~req.url.indexOf('/favicon.ico')){
    return res.status(200).send('ok')
  }
  return next()
}
