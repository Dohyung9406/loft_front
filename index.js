const express = require('express');
const app = express();
const port = 8081;
const bodyParser = require('body-parser');
const {User} = require("./models/User");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mongoose = require('mongoose');
const config = require("./config/key");

mongoose.connect(config.mongoURI).then(() => console.log("Monggo DB Conected..."))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!~');
});

app.post('/register', async(req,res) => {
  // 회원 가입 시 필요한 정보를 받고 DB에 저장 처리

  const user = new User(req.body);

  // mongo DB 메소드
  // https://www.inflearn.com/questions/805491 참고
  const result = await user.save().then(()=>{
    return res.status(200).json({
      success: true
    });
  }).catch((err) =>{
    console.log(err);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});