
var express = require('express');
var app = express();

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
    extended: false
}));
app.use(express.static('main.css'));

var books =
    [
        {
            "title": "A Promised Land",
            "author": "Barack Obama",
            "publisher": "Crown",
            "date": "November 17, 2020",
            "website": "https://www.chapters.indigo.ca/en-ca/books/a-promised-land/9781524763169-item.html?ikwid=obama&ikwsec=Home&ikwidx=1#algoliaQueryId=25558a99d98968a203953344c6a079d8"
        },
        {
            "title": "An Astronaut's Guide To Life On Earth",
            "author": "Chris Hadfield",
            "publisher": "Random House of Canada",
            "date": "September 1, 2015",
            "website": "https://www.chapters.indigo.ca/en-ca/books/an-astronauts-guide-to-life/9780345812711-item.html?ikwid=chris+hadfield&ikwsec=Home&ikwidx=2#algoliaQueryId=cab8339a71c0681f35987cefebb26de8"
        },
        {
            "title": "Will",
            "author": "Will Smith",
            "publisher": "Random House Publishing Group",
            "date": "November 9, 2021",
            "website": "https://www.chapters.indigo.ca/en-ca/books/will/9781984877925-item.html?ref=shop%3abooks%3abooks-main%3abuzzworthy-books%3a1%3a"
        }
    ]

app.get('/bookinventory/list', function (req, res) {

    var html = '<p>'
    for (var i = 0; i < books.length; i++) {
        html = html + '<b>Title: </b>' + books[i].title + '<br>';
        html = html + '<b>Author: </b>' + books[i].author + '<br>';
        html = html + '<b>Publisher: </b>' + books[i].publisher + '<br>';
        html = html + '<b>Date: </b>' + books[i].date + '<br>';
        html = html + '<b>Website: </b>' +  books[i].website  + '<br><br>';
    }
    html += '</p>'
    // res.send('')
    res.send('<h1>Fareed Syed: LAB6</h1><h2>List of Books: </h2>' + html);
});


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

    var new_json = {
        'title': new_title,
        'author': new_author,
        'publisher': new_publisher,
        'date': new_date,
        'website': new_web
    };
    books.push(new_json);

    res.send('New book is added!<br><br><a href="/bookinventory/list">List of books.</a>');
});

app.listen(3000);