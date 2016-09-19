module.exports = init

function init(app, User, Loca, Pass) {
  app.get('/and', function(req, res) {
    res.send('And')
  })
  app.post('/and/register', function(req, res){
    user = new User({
      id : req.param('id'),
      password : req.param('password'),
      username : req.param('username')
    })
  })
  app.post('/and/setlocation', function(req, res) {
    // res.send('/and/setlocation')
    User.findOne({id : req.param('id')}, function(err, result) {
      if(err){
        console.log("/and/setlocation user find err")
        throw err
      }
      if(result){
        Loca.findOne({id : req.param('id')}, function(err, result) {
          if(err){
            console.log("/and/setlocation Loca find err")
            throw err
          }
          if(result){
            console.log('/and/setlocation User loca info exist')
            result.loca_g = req.param('loca_g')
            result.loca_w = req.param('loca_w')
            result.save(function(err) {
              if(err){
                console.log("/and/setlocation Loca Save err")
                throw err
              }else{
                res.send(200, result)
              }
            })
          }else{
            console.log('/and/setlocation User loca info not exist')

            var loca = new Loca({
              id : req.param('id'),
              loca_g : req.param('loca_g'),
              loca_w : req.param('loca_w')
            })
            loca.save(function(err) {
              if(err){
                console.log('/and/setlocation Loca Save Err')
                throw err
              }else{
                res.send(200, loca)
              }
            })
          }
        })
      }else{
        rse.send(401, {massage : "유저 정보가 없습니다."})
      }
    })
  })
}
