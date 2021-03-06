var express = require("express");
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://ryerson:123456a@chatapp.pllqz.mongodb.net/WeatherMapDB?retryWrites=true&w=majority"
var alert = require("alert");
let ejs = require('ejs');
let fs = require('fs')

var app = express();

app.use(bodyParser.json());
app.use(express.static('Static'));
app.use(bodyParser.urlencoded({
    extended: true
}))
app.set('view engine', 'html');

app.get('/weathermap', function (req, res) {
    return res.redirect('WeatherServiceMap.html')
})


app.post("/weathermap", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("WeatherMapDB");
        var userInfo = {
            "email": email,
            "password": password,
            "firstName": firstName,
            "lastName": lastName
        }

        db.on('error', () => console.log("Error in connecting to the Database."));
        db.once('open', () => console.log("Connected to the Database!"));

        dbo.collection('users').insertOne(userInfo, function (err, collection) {
            if (err) throw err;
            console.log("User Info Record Inserted Successfully!")
            db.close();
        });
    });

    return res.redirect('WeatherServiceMap.html')
})

app.post("/login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("WeatherMapDB");
        var loginInfo = {
            'email': email,
            'password': password
        }

        db.on('error', () => console.log("Error in connecting to the Database."));
        db.once('open', () => console.log("Connected to the Database!"));

        console.log("checking if user exists.")

        dbo.collection("users").find(loginInfo).toArray(function (err, result) {
            if (err) throw err;

            if (result.length === 0) {
                console.log("User not found. Please signup.");
                res.redirect('/usernotfound');

            } else {
                console.log("Logged in Successfully!");
                return res.redirect('WeatherServiceMap.html');
            }
        });
    });
})

app.get('/login', function (req, res) {
    res.render('index', {message: 'User not found'});
    // res.send('Username not found!')
})

app.get('/', function (req, res) {
    return res.redirect('index.html');
})

app.get('/signup', function (req, res) {
    return res.redirect('signup.html');
})

app.get('/home', function (req, res) {
    return res.redirect('Home.html');
})

app.get('/usernotfound', function (req, res) {
    res.send('<p><b style="color: red">Error 404: </b>Username or Password not found!<br>' +
        '<a style="color: blue" href="/signup">Please Signup</a></p>')
})


app.listen(3000, () => {
    console.log("Server is working!")
})
