const mysql = require("mysql2"),
      express = require("express"),
      bodyParser = require("body-parser"),
      popup = require("node-popup"),
      session = require('express-session'),
      flash = require('connect-flash'),
      passport = require('passport'),
      localStrategy = require('passport-local').Strategy,
      cookieParser = require('cookie-parser'),
      app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static('${__dirname}/assets'));
app.use(express.static('views/images'));

app.use(cookieParser());

const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "mysql",
  database: "projectDTB",
  password: "mysql"
});

app.set("view engine", "hbs");

app.get("/", function(req, res){
    if (req.cookies['token']) {
      pool.query("SELECT login FROM sessionlog WHERE session_name = ? LIMIT 1", [req.cookies['token']], function(err, data) {
        console.log('куки токен ', data);
        res.render("index.hbs", {
            users: data
        });
      });
    }
    else {
      res.render("index.hbs");
    }
});

app.get("/signup", function(req, res) {
    res.render("signup.hbs");
});

app.post("/signup", urlencodedParser, function(req, res) {
    if(!req.body) return res.sendStatus(400);
    const login = req.body.login;
    const pass = req.body.pass;
    pool.query("SELECT * FROM pass WHERE login = ? AND pass = ?", [login, pass], function(err, data) {
        if (err) {
          popup.alert("кудааааа пашоооол");
        }
        else {
          pool.query("INSERT INTO sessionlog (session_name, login) VALUES (?, ?)", [login + pass, login], function(err, data) {
            if (err) {
              console.log("Ошибка добавления сессии");
            }
          });
          res.cookie('token', login + pass);
          res.render("index.hbs", {
              users: data
          });
        }
    });
});

app.get("/register", function(req, res) {
    res.render("register.hbs");
});

app.post("/register", urlencodedParser, function(req, res){
    if(!req.body) return res.sendStatus(400);
    const login = req.body.login;
    const pass = req.body.pass;
    pool.query("INSERT INTO pass (login, pass) VALUES (?, ?)", [login, pass], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
  });
});

/*app.get("/bin", function(req, res) {
    render
});*/

app.listen(8080, function() {
    console.log("Пора в Интернет, брат");
});
