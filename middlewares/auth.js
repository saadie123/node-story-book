module.exports = {
    authenticateUser: (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/');
    },
    authenticateGuest: (req, res, next) => {
        if(req.isAuthenticated()){
            return res.redirect('/dashboard');
        }
        next();
    }
}