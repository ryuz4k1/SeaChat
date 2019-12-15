"use strict";

const express                   = require("express");
const bodyParser                = require('body-parser');
const ejs                       = require("ejs");
const passport                  = require('passport');
const session                   = require('express-session');
const cookieParser              = require('cookie-parser');
const Utils                     = require('../src/helpers/utils');
const dotenv                    = require('dotenv').config();

// db Connection
const Connection                = require('../src/helpers/connection');

//Controllers
const IndexController           = require("../src/controllers/index-controller");
const AuthorizationController   = require("../src/controllers/authorization-controller");
const ChatController            = require("../src/controllers/chat-controller");
const MessagesController        = require("../src/controllers/messages-controller");
const UserController            = require("../src/controllers/user-controller");

// Middleware
const AuthenticationMiddleware  = require("../src/middleware/authentication-middleware");


class App {
  constructor() {
      this.app = express();

      this.config();
      this.controllers();

      this.Connection = new Connection().mongoDB();
  }

  config() {
     // Add headers
     this.app.use(function (req, res, next) {

      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

       // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);

      // Pass to next layer of middleware
      next();
  });
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
      secret: process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 14 * 24 * 360000 }
    }));

    //config
    this.app.set('apiKey', process.env.REDIS_URI);

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
    
    router = express.Router();
    this.app.use("/messages", router);
    new MessagesController(router);
    
    router = express.Router();
    this.app.use("/user", router);
    new UserController(router);
  };

  getApp() {
    return this.app;
  }

}

module.exports = App;
