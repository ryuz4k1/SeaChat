"use strict";

const redis          = require('redis')
const packageJson    = require("../../package.json");
const Types          = require("../helpers/types");
const session        = require('express-session')
const config         = require('../../config.json')
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
        let redisStore =  new RedisStore({
            host: config.REDIS_URI,
            port: config.REDIS_PORT,
            pass: config.REDIS_PASS,
            client: redisClient
        });

        return redisStore;
    };

}

module.exports = Utils;
