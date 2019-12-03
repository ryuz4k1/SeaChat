"use strict";

const express                   = require("express");
const bodyParser                = require("body-parser");
const ejs                       = require("ejs");
const passport                  = require('passport');
// db Connection
const Connection                = require('../src/helpers/connection');

//Controllers
const IndexController           = require("../src/controllers/index-controller");
const AuthController            = require("../src/controllers/auth-controller");

// Middleware

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
    //db connection
    this.Connection;

    // passport.js
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    
    // ... Body parser
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json()); //json tipinde gelicek post datalarını karşılar

    // view engine setup
    this.app.engine(".ejs", ejs.__express);
    this.app.set("views", __dirname + "/view");    

    //config
    this.app.set('apiKey', config.apiKey.key);

  }

  controllers(){
    this.app.use("/public", express.static("public"));
    this.app.use("/bower_components", express.static("bower_components"));

    // ... Index Controller
    let router = express.Router();
    this.app.use("/", router);
    new IndexController(router);
    
    router = express.Router();
    this.app.use("/auth", router);
    new AuthController(router);
  };

  getApp() {
    return this.app;
  }

}

module.exports = App;
