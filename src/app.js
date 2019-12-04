"use strict";

const express                   = require("express");
const bodyParser                = require('body-parser');
const ejs                       = require("ejs");
const passport                  = require('passport');
const session                   = require('express-session');
const cookieParser              = require('cookie-parser');
const Utils                     = require('../src/helpers/utils')

// db Connection
const Connection                = require('../src/helpers/connection');

//Controllers
const IndexController           = require("../src/controllers/index-controller");
const AuthorizationController   = require("../src/controllers/authorization-controller");
const ChatController            = require("../src/controllers/chat-controller");

// Middleware
const AuthenticationMiddleware  = require("../src/middleware/authentication-middleware");

//Config
const config                    = require('../config.json');


class App {
  constructor() {
      this.app = express();

      this.config();
      this.controllers();

      this.Connection = new Connection().mongoDB();
  }

  config() {
    this.utils = new Utils();

    //db connection
    this.Connection;

    // passport.js
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    
    // ... Body parser
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json()); //json tipinde gelicek post datalarını karşılar
    this.app.use(cookieParser());

    // view engine setup
    this.app.engine(".ejs", ejs.__express);
    this.app.set("views", __dirname + "/views");
    this.app.set('view engine', 'ejs');
    
    // ... Express session
    this.app.use(session({
      store: this.utils.connectRedisStore(),
      secret: config.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 14 * 24 * 360000 }
    }));

    //config
    this.app.set('apiKey', config.apiKey.key);

  }

  controllers(){
    this.app.use("/public", express.static("public"));
    this.app.use("/bower_components", express.static("bower_components"));
    
    // ... Define routes
    let router = express.Router();
    this.app.use("/auth", router);
    new AuthorizationController(router);

    // ... Index Controller
    router = express.Router();
    this.app.use("/", router);
    new IndexController(router);
    
    // ... Authentication middleware
    const authenticationMiddleware = new AuthenticationMiddleware();
    this.app.use(authenticationMiddleware.session);
    
    router = express.Router();
    this.app.use("/chat", router);
    new ChatController(router);
  };

  getApp() {
    return this.app;
  }

}

module.exports = App;
