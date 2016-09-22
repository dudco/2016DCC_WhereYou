module.exports = init

function init(app, User, Pass) {
  app.post('/login', Pass ,function(req, res) {
    res.send(req.user)
  })
  app.post('/register', function(req, res){
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
  app.get('/logout', function(req, res){
    req.logout();
    req.session.save(function(){
      res.redirect('/');
    });
  });
  app.get('/nowuser',function(req, res) {
    if(!req.user){
      console.log("not logined");
      req.send(400, {message : "not logined"})
    }else{
      console.log(req.user);
      res.send(200, req.user)
    }
  })
  app.post('/addfriend', function(req, res) {
    User.findOne({id : req.param('id')},'Friend', function(err, user) {
        console.log(user);

        for (variable of user.Friend) {
            if(variable == req.param('Fid')){
              console.log("Friend already Exist");
              res.send(400, {massage : "Friend already Exist"})
              return;
            }
        }
      User.findOne({id : req.param('Fid')}, function(err, friend) {
        if(err){
          console.log("err"+err);
          throw err;
        }
        if(!friend){
          console.log("user not find");
          res.send(400, {message : "user not find"})
        }else{
          user.Friend.push(req.param('Fid'))
          user.save(function(err) {
            if(err){
              console.log("user save err");
              res.send(400, {message : "user save err"})
            }else{
              res.send(200, user)
            }
          })
        }
      })
    })
  })
  app.post('/getfriendlist', function(req, res) {
    User.findOne({id : req.param('id')},'Friend', function(err, friend_list) {
      for (var variable of friend_list.Friend) {
          console.log(variable);
      }
      res.send(200, friend_list)
    })
  })
}
