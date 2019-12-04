const config            = require('../../config.json');

const Messages = require('../lib/Messages');

class MessagesController{
    constructor(router){
        this.router = router;
        this.routes();
    }

    async list(req,res) {
        try {
            Messages.list(req.query.roomId, messages => {
                res.json(messages);
            });
        } catch (error) {
            console.log(error);
        }
    }

    routes(){
        this.router.get("/list", this.list.bind(this));
    };

};

module.exports = MessagesController;