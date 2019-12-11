class UserController{
    constructor(router){
        this.router = router;
        this.routes();
    }

    async getUser(req,res) {
        try {
            return res.json(req.session.user);
        } catch (error) {
            console.log(error);
        }
    }

    routes(){
        this.router.get("/", this.getUser.bind(this));
    };

};

module.exports = UserController;