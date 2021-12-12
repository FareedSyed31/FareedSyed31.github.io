var express = require("express");
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://ryerson:123456a@chatapp.pllqz.mongodb.net/WeatherMapDB?retryWrites=true&w=majority"
var https = require('https')

// let ejs = require('ejs');
// var pause = require('./pause')

var app = express();

app.use(bodyParser.json());
app.use(express.static('Static'));
app.use(bodyParser.urlencoded({
    extended: false
}))
app.set('view engine', 'html');

app.get('/defineword', function (req, res) {
    return res.redirect('DictionaryWeb.html')
})

app.post("/defineword", function (req, res) {
    // pause(3000)
    //     .then(function () {
    var word = req.body.word;
    var def = ''
    var image = ''
    let data = ''
    let imageid = ''


    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DictionaryDB");
        var word_def = {
            "word": word,
        }

        db.on('error', () => console.log("Error in connecting to the Database."));
        db.once('open', () => console.log("Connected to the Database!"));
        dbo.collection("definitions").createIndex({expireAfterSeconds: 5000});


        dbo.collection("definitions").find(word_def).toArray(function (err, result) {
            if (err) throw err;

            if (result.length === 0) {
                console.log("Word not found. Recording word to database.");

                // open http request
                https.get("https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word.toString() + "?key=f25f4086-c864-4fb8-8009-8e55a75cf65f", (resp) => {
                    let data = '';

                    // A chunk of data has been received.
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });

                    // The whole response has been received. Print out the result.
                    resp.on('end', () => {
                        data = JSON.parse(data)
                        data_keys = Object.keys(data[0])
                        try {
                            def = data[0].def[0].sseq[0][1][1].dt[0][1]
                        } catch (err) {
                            def = data[0].shortdef
                        }

                        if (data_keys.includes("art")) {
                            imageid = data[0].art.artid
                            caption = data[0].art.capt
                            image = "https://www.merriam-webster.com/assets/mw/static/art/dict/" + imageid + ".gif"
                        } else {
                            image = "https://i.imgur.com/D1nM11A.png"
                        }
                        word_def = {
                            "word": word,
                            "definition": def,
                            "image": image,
                        }

                        dbo.collection('definitions').insertOne(word_def, function (err, collection) {
                            if (err) throw err;
                            console.log("Word definition Record Inserted Successfully!")
                            // db.close();
                            dbo.collection("definitions").find({}, {projection: word_def}).toArray(function (e, r) {
                                if (e) throw err;

                                if (r.length === 0) {
                                    console.log("definiton not found")
                                } else {
                                    def = r[0].definition
                                    image = r[0].image

                                    var html = '<head>\n' +
                                        '    <meta charset="UTF-8">\n' +
                                        '    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"\n' +
                                        '          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">\n' +
                                        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
                                        '    <meta http-equiv="X-UA-compatible" content="ie=edge">\n' +
                                        '    <title>Dictionary Web</title>\n' +
                                        '    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>\n' +
                                        '</head>\n' +
                                        '\n' +
                                        '\n' +
                                        '<body>\n' +
                                        '<ul class="nav justify-content-center"\n' +
                                        '    style="margin-left: 30%; margin-right: 30%; margin-top: 20px; font-size: x-large">\n' +
                                        '    <li class="nav-item">\n' +
                                        '        <a class="nav-link active" aria-current="page" href="/defineword">Word Dictionary</a>\n' +
                                        '    </li>\n' +
                                        '    <li class="nav-item">\n' +
                                        '        <a class="nav-link" href="/">Logout</a>\n' +
                                        '    </li>\n' +
                                        '</ul>\n' +
                                        '\n' +
                                        '<form action="defineword" method="post" class="row g-3" style="margin-left: 40%; margin-right: 40%; margin-top: 0.5%"\n' +
                                        '      id="dictionaryForm">\n' +
                                        '    <div class="col-12">\n' +
                                        '        <label for="word" class="form-label">Enter a word:</label>\n' +
                                        '        <input type="text" class="form-control" id="word" name="word" placeholder="Enter a word" required>\n' +
                                        '    </div>\n' +
                                        '    <div class="col-12">\n' +
                                        '        <button id="findword" type="submit" class="btn btn-primary">Search</button>\n' +
                                        '    </div>\n' +
                                        '    <br>\n' +
                                        '    <div class="-12">\n' +
                                        '        <b>Word: </b>' +
                                        '        <p>' + word + '</p>' +

                                        '        <b id="definition_heading">Definition: </b>\n' +
                                        '        <output id="definition" name="definition">' + def + '</output>\n' +
                                        '        <br>\n' +
                                        '        <br>\n' +
                                        '        <b id="illustration_heading">Illustrations: </b>\n' +
                                        '        <p><img id="illustration" src="' + image + '"></p>\n' +
                                        '\n' +
                                        '    </div>\n' +
                                        '</form>' +
                                        '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"\n' +
                                        '        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"\n' +
                                        '        crossorigin="anonymous"></script>' +
                                        '</body>'

                                    res.send(html)
                                }
                            })


                        });


                    });

                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                });


            } else {
                console.log("Word found in database.");
                def = result[0].definition
                image = result[0].image


                var html = '<head>\n' +
                    '    <meta charset="UTF-8">\n' +
                    '    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"\n' +
                    '          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">\n' +
                    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
                    '    <meta http-equiv="X-UA-compatible" content="ie=edge">\n' +
                    '    <title>Dictionary Web</title>\n' +
                    '    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>\n' +
                    '</head>\n' +
                    '\n' +
                    '\n' +
                    '<body>\n' +
                    '<ul class="nav justify-content-center"\n' +
                    '    style="margin-left: 30%; margin-right: 30%; margin-top: 20px; font-size: x-large">\n' +
                    '    <li class="nav-item">\n' +
                    '        <a class="nav-link active" aria-current="page" href="/defineword">Word Dictionary</a>\n' +
                    '    </li>\n' +
                    '    <li class="nav-item">\n' +
                    '        <a class="nav-link" href="/">Logout</a>\n' +
                    '    </li>\n' +
                    '</ul>\n' +
                    '\n' +
                    '<form action="defineword" method="post" class="row g-3" style="margin-left: 40%; margin-right: 40%; margin-top: 0.5%"\n' +
                    '      id="dictionaryForm">\n' +
                    '    <div class="col-12">\n' +
                    '        <label for="word" class="form-label">Enter a word:</label>\n' +
                    '        <input type="text" class="form-control" id="word" name="word" placeholder="Enter a word" required>\n' +
                    '    </div>\n' +
                    '    <div class="col-12">\n' +
                    '        <button id="findword" type="submit" class="btn btn-primary">Search</button>\n' +
                    '    </div>\n' +
                    '    <br>\n' +
                    '    <div class="-12">\n' +
                    '        <b>Word: </b>' +
                    '        <p>' + word + '</p>' +

                    '        <b id="definition_heading">Definition: </b>\n' +
                    '        <output id="definition" name="definition">' + def + '</output>\n' +
                    '        <br>\n' +
                    '        <br>\n' +
                    '        <b id="illustration_heading">Illustrations: </b>\n' +
                    '        <p><img id="illustration" src="' + image + '"></p>\n' +
                    '\n' +
                    '    </div>\n' +
                    '</form>' +
                    '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"\n' +
                    '        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"\n' +
                    '        crossorigin="anonymous"></script>' +
                    '</body>'

                res.send(html)
            }
        });
    })
})

app.post("/dictionary", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DictionaryDB");
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

    return res.redirect('DictionaryWeb.html')
})

app.post("/login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DictionaryDB");
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
                return res.redirect('DictionaryWeb.html');
            }
        });
    });
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
