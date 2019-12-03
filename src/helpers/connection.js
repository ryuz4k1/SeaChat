"use strict";

const mongoose = require("mongoose");
const config = require('../../config.json')

class Connection {

    // ... Mongodb 
    mongoDB() {
        const mongodb =  mongoose.connect(config.DB_URL,{useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.connection.on('open', () => {
            console.log('Connected');
        });
        mongoose.connection.on('error', (err) => {
            console.log(err);
        });
        return mongodb;
    };
};

module.exports = Connection;