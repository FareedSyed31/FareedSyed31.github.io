var express = require("express");
var app = express();

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://ryerson:123456a@chatapp.pllqz.mongodb.net/WeatherMapDB?retryWrites=true&w=majority"

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
    extended: false
}));
app.use(express.static('Static'));

app.get('/', function (req, res) {
    res.write("<h1>Welcome to LAB8</h1>");
    res.write("<h1>Fareed Syed</h1>");
    res.write("<a style='color: blue' href=\"/bookinventory/list\">Inventory List</a><br>");
    res.write("<a style='color: blue' href=\"/bookinventory/add\">Add book</a><br>");
    res.end();
})

app.get('/bookinventory/list', function (req, res) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");


        db.on('error', () => console.log("Error in connecting to the Database."));
        db.once('open', () => console.log("Connected to the Database!"));

        dbo.collection("books").find().toArray(function (err, books) {
            if (err) throw err;

            if (books.length === 0) {
                console.log("User not found. Please signup.");
                res.redirect('/login')
            } else {
                console.log("Book Inventory found Successfully!");
                var html = '<p>'
                for (var i = 0; i < books.length; i++) {
                    html = html + '<b>Title: </b>' + books[i].title + '<br>';
                    html = html + '<b>Author: </b>' + books[i].author + '<br>';
                    html = html + '<b>Publisher: </b>' + books[i].publisher + '<br>';
                    html = html + '<b>Date: </b>' + books[i].date + '<br>';
                    html = html + '<b>Website: </b>' + books[i].website + '<br><br>';
                }
                html += '</p>'
                res.send('<h1>Fareed Syed: LAB8</h1><h2>List of Books: </h2>' + html);
            }
        });
    });
})

app.get('/bookinventory/add', function (req, res) {

    var html = '<br><form action="/bookinventory/addbooks" method="post">' +
        '<label for="btitle">Title:</label><br><input type="text" id="btitle" name="btitle"><br>' +
        '<label for="bauthor">Author:</label><br><input type="text" id="bauthor" name="bauthor"><br>' +
        '<label for="bpublisher">Publisher:</label><br><input type="text" id="bpublisher" name="bpublisher"><br>' +
        '<label for="bdate">Date:</label><br><input type="text" id="bdate" name="bdate"><br>' +
        '<label for="bweb">Website:</label><br><input type="text" id="bweb" name="bweb">' +
        '<br><input type="submit" value="Submit"><br>' +
        '</form>'

    res.send('Add a book: ' + html);
});

app.post('/bookinventory/addbooks', function (req, res) {

    console.log(req.body);

    var new_title = req.body.btitle;
    var new_author = req.body.bauthor;
    var new_publisher = req.body.bpublisher;
    var new_date = req.body.bdate;
    var new_web = req.body.bweb;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var new_json = {
            'title': new_title,
            'author': new_author,
            'publisher': new_publisher,
            'date': new_date,
            'website': new_web
        };

        db.on('error', () => console.log("Error in connecting to the Database."));
        db.once('open', () => console.log("Connected to the Database!"));

        dbo.collection('books').insertOne(new_json, function (err, collection) {
            if (err) throw err;
            console.log("Book Added Successfully!")
            db.close();
        });
    });

    // books.push(new_json);

    res.send('New book is added!<br><br><a href="/bookinventory/list">List of books.</a>');
});

app.listen(3000, () => {
    console.log("Server is working!")
})
