"use strict";

const redis          = require('redis')
const packageJson    = require("../../package.json");
const Types          = require("../helpers/types");
const session        = require('express-session')
let RedisStore       = require('connect-redis')(session);
let redisClient      = redis.createClient()

class Utils {
    
    // ... Set result
    setResult(code, message, data) {
        var result = {
            code: code,
            message: message,
            data: data,
            time: Date.now(),
            api: {
                author: packageJson.author,
                name: packageJson.name,
                description: packageJson.description,
                version: packageJson.version
            }
        }
        return result;
    };

    connectRedisStore(){
        const redisStore =  new RedisStore({
            host: process.env.REDIS_URI,
            port: process.env.REDIS_PORT,
            pass: process.env.REDIS_PASS,
            client: redisClient
        });

        return redisStore;
    };

}

module.exports = Utils;
