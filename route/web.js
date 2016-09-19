module.exports = init

function init(app, User, Loca, Pass) {
  app.get('/web', function(req, res) {
    res.send('Web')
  })

  app.post('/web/getlocation', function(req, res) {
    Loca.findOne({id : req.param('id')}, function(err, result) {
      if(err){
        console.log("/web/getloca Loca.findOne Err!")
        throw err
      }
      if(result){
        res.send(200, result)
      }else{
        res.send(400, {massage : "해당 ID의 location정보가 없습니다."})
      }
    })
  })
}
