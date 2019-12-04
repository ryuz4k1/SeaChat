"use strict";
const crypto            = require("crypto");
const Utils             = require("../helpers/utils");
const Types             = require("../helpers/types");
const User              = require("../models/user-model");
const passportGoogle    = require('../auth/google');

class AuthorizationController {

    constructor(router) {
        this.router = router;
        this.routers();

        this.utils = new Utils();
    }

    login(req, res) {       
        if (!req.session.user){
            return res.render("./authorization/login.ejs");
        }
        else{
            return res.redirect('/chat');
        }
    }
    
    async loginUser(req, res) { 
        try {
            // ... Password hash
            req.body.password = crypto.createHash("sha256").update(req.body.password).digest("hex");

            const result = await User.findOne({ where: { email: req.body.email, password: req.body.password, isDeleted: false }});
            if (!result) {
                return res.render("../views/authorization/login.ejs", { code: Types.Status.NOTFOUND });
            }
            
            // ... Save session
            req.session.user = result;

            return res.redirect("/");
        } 
        catch (err) {
            console.log(err);
        }
    }

    logout(req, res) {
        // ... Destroy sessison
        req.session.destroy();

        // ... Redirect
        return res.redirect("/auth/login");
    }

    unauthorized(req, res) {
        return res.render("../views/authorization/unauthorized.ejs");
    }

    google(req, res, next){
        try {
            
        } 
        catch (error) {
            console.log(error);
        }
    }

    googleCallback(req, res, next){
        try {
            // ... Save session
            req.session.user = req.user;
            return res.redirect('/chat');
        } 
        catch (error) {
            console.log(error);
        }
    }
    
    // ... Register routers
    routers() {
        this.router.get("/login", this.login.bind(this));
        this.router.get("/logout", this.logout.bind(this));
        this.router.get("/unauthorized", this.unauthorized.bind(this));
        //this.router.post("/login", this.loginUser.bind(this));
        this.router.get("/google", passportGoogle.authenticate('google',{scope: ['profile']}) ,this.google.bind(this));
        this.router.get("/google/callback",passportGoogle.authenticate('google',{failureRedirect: '/'}),this.googleCallback.bind(this));
    }
}

module.exports = AuthorizationController;