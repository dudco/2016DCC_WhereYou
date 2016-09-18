module.exports = init

function init(app, User, Loca) {
  app.get('/web', function(req, res) {
    res.send('Web')
  })

  app.post('/web/login', function(req, res){
    console.log("User Login : " + req.param('id'))
    //유저 찾기
    User.findOne({id : req.param('id')}, function (err, result) {
        if(err){
            console.log("/auth/login failed")
            throw err
        }
        console.log("DB Founded : "+ result)
        if(result){
          if(result.pw == req.param('password')){
            //패스워드 일치
              console.log("User "+ result.name+ "Logged In");
              res.send(200, result)
              // //Loacatioin db update
              // Loca.findOne({id : req.param('id')}, function (err, result) {
              //   if(err){
              //     console.log("Loacation err")
              //     throw err
              //   }
              //   if(result){
              //     result.location_w = req.param('location_w');
              //     result.location_g = req.param('location_g');
              //     res.json(result)
              //   }else{
              //     loca = new Loca({
              //       id : req.param('id'),
              //       location_g : req.param('location_g'),
              //       location_w : req.param('location_w')
              //     })
              //
              //     loca.save(function(err){
              //       if(err){
              //         console.log("location save err")
              //         throw err
              //       }else{
              //         console.log("location save success\n"+loca)
              //         res.json({
              //           success : true,
              //           massage : loca
              //         })
              //       }
              //     })
              //   }
              // })
              // res.json(result)
          }else if(result.password != req.param('password')){
            //패스워드 오류
              console.log("Password Error")
              res.send(401, {massage : "패스워드 오류 입니다."})
          }
        }else{
          res.send(401, {massage : "ID오류 입니다."})
        }
    })
  })

  app.post('/web/register', function(req, res){
    user = new User({
      id : req.param('id'),
      pw : req.param('password'),
      username : req.param('username'),
      MD : new Date()
    })

    User.findOne({id : req.param('id')}, function(err, result) {
      if(err){
        //에러 발생
        console.log(err)
        throw err
      }
      if(result){
        //아이디가 같은 유저 존재
        res.send(400, {massage : "같은 ID가 존재합니다."})
      }else{
        //아이디 같은 유저 없음 -> db에 저장
        user.save(function(err) {
          if(err){
            //저장중 에러 발생
            console.log("user save err")
            throw err
          }else{
            //저장 성공
            console.log("user save Success")
            res.send(200, user)
          }
        })
      }
    })
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
