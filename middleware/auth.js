const {User} = require('../models/User');

let auth = (req, res, next) => {
    // 인증 처리
    // 클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.X_auth;

    console.log("auth cookie : " + req.cookies.X_auth);

    // 토큰 복호화 후 계정 찾기
    User.findByToken(token, (err,user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true});

        console.log("auth user : " + user);
        req.token = token;
        req.user = user;
        next();
    });
    // 계정 있으면 인증 처리
}

module.exports = { auth };