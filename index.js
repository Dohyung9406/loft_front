const express = require('express');
const app = express();
const port = 8081;
const bodyParser = require('body-parser');
const {User} = require("./models/User");
const {auth} = require("./middleware/auth");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mongoose = require('mongoose');
const config = require("./config/key");

mongoose.connect(config.mongoURI).then(() => console.log("Monggo DB Conected..."))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!~');
});

app.post('/api/users/register', async(req,res) => {
  // 회원 가입 시 필요한 정보를 받고 DB에 저장 처리
  try {
    const user = new User(req.body);

    // mongo DB 메소드
    // https://www.inflearn.com/questions/805491 참고
    await user.save();
    
    return res.status(200).json({success:true});
  } catch (err) {
    return res.status(400).send(err);
  }
  
});

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.post('/api/users/login', async (req,res) => {
  try {
    // 이메일로 로그인 후 토큰 생성까지
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        loginSuccess : false,
        message: "없는 이메일 입니다."
      });
    }

    //비밀번호 확인
    user.comparePassword(req.body.password, (err, isMatch) =>{
      if(!isMatch) {
        return res.json({loginSuccess: false, message:"비밀번호 틀렸습니다."});
      }
    });

    //토큰 생성
    const userToken = await user.generateToken();
    res.cookie("X_auth", userToken.token).status(200).json({loginSuccess: true, userId: user._id});

  } catch (err) {
    return res.status(400).send(err);
  }
});

app.get('/api/users/auth', auth, async (req,res) =>{
  res.status(200).json({
    _id: req.user_id,
    isAdmin: req.user.role === 0 ? false : true, 
    isAuth: true,
    email: req.user.email
  });
});


app.get('/api/users/logout', auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({_id: req.user._id}, {token: ""});
    
    return res.json({return : "success"});
  } catch (err) {
    return res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});