"use strict";

class AuthenticationMiddleware {
    // ... Session
    session(req, res, next) {
        if (req.isAuthenticated()){
            return next();
        }
        else {
            return res.redirect("/auth/login");
        }
    }
}

module.exports = AuthenticationMiddleware;