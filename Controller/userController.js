const user = require("../models/user.js");

module.exports.renderSignUpForm = (async (req,res)=>{
    res.render("users/signup.ejs");
});

module.exports.signup=(async(req,res)=>{
    let {username,email,password} = req.body;
    const newUser = new user({email,username});
    let registeredUser = await user.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        res.redirect("/listing");
    })
});

module.exports.renderLogInForm = (async (req,res)=>{
    res.render("users/login.ejs");
});

module.exports.login = (async (req,res)=>{
    if(res.locals.redirectUrl)
        res.redirect(res.locals.redirectUrl);
    else
        res.redirect("/listing");
});

module.exports.logout = (async (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        res.redirect("/listing");
    })
});