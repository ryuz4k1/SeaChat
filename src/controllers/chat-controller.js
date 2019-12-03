const config = require('../../config.json');

class ChatController{
    constructor(router){
        this.router = router;
        this.routes();
    }

    async index(req, res){
        try {
            return res.render("../views/chat/chat.ejs");
        } 
        catch (error) {
            console.log(error);
        }
    }

    routes(){
        this.router.get("/", this.index.bind(this));
    };

};

module.exports = ChatController;