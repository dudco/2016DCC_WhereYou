module.exports = init

function init(app, User, Loca) {
  app.get('/and', function(req, res) {
    res.send('Web')
  })
  app.post('/and/login', function(req, res){
    console.log("User Login : " + req.param('id'))
    //유저 찾기
    User.findOne({id : req.param('id')}, function (err, result) {
        if(err){
            console.log("/and/login failed")
            throw err
        }
        console.log("DB Founded : "+ result)
        if(result){
          if(result.pw == req.param('password')){
            //패스워드 일치
              console.log("User "+ result.name+ "Logged In");
              console.log("User Location Update");
              //Loacatioin db update
              Loca.findOne({id : req.param('id')}, function (err, result) {
                if(err){
                  console.log("Loacation err")
                  throw err
                }
                if(result){
                  console.log("ID Location info Exist")
                  result.loca_w = req.param('location_w');
                  result.loca_g = req.param('location_g');
                  result.save(function(err) {
                    if(err){
                      console.log("/and/login Loca.find Error")
                      throw err
                    }else{
                      res.send(200, result)
                    }
                  })
                }else{
                  console.log("ID Location info Not Exist")
                  loca = new Loca({
                    id : req.param('id'),
                    loca_g : req.param('location_g'),
                    loca_w : req.param('location_w')
                  })

                  loca.save(function(err){
                    if(err){
                      console.log("location save err")
                      throw err
                    }else{
                      console.log("location save success\n"+loca)
                      res.send(200, loca)
                    }
                  })
                }
              })
          }else if(result.password != req.param('password')){
            //패스워드 오류
              console.log("Password Error")
              res.send(401, {massage : "패스워드 오류 입니다."})
          }
        }else{
          res.send(401, {massage : "ID 오류 입니다."})
        }
    })
  })
  app.post('/and/register', function(req, res){
      user = new User({
        id : req.param('id'),
        password : req.param('password'),
        username : req.param('username')
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
}
