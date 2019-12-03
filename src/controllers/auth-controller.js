const passportGoogle = require('../auth/google');

class AuthController {
    constructor(router){
        this.router = router;
        this.routes();
    }

    async google(req, res, next){
        try {
            
        } 
        catch (error) {
            console.log(error);
        }
    }

    async googleCallback(req, res, next){
        try {
            return res.redirect('/chat');
        } 
        catch (error) {
            console.log(error);
        }
    }

    routes(){
        this.router.get("/google", passportGoogle.authenticate('google',{scope: ['profile']}) ,this.google.bind(this));
        this.router.get("/google/callback",passportGoogle.authenticate('google',{failureRedirect: '/'})),this.googleCallback.bind(this);
    };

};

module.exports = AuthController;