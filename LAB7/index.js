var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://ryerson:123456a@chatapp.pllqz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("books", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");

    var books = [
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
        },
        {
            "title": "The Apollo Murders",
            "author": "Chris Hadfield",
            "publisher": "Random House of Canada",
            "date": "SOctober 12, 2021",
            "website": "https://www.chapters.indigo.ca/en-ca/books/the-apollo-murders/9780735282353-item.html?ikwsec=Home&ikwidx=2#algoliaQueryId=320ae0c1e6b31d3d6ff907b0bc220be1"
        },
        {
            "title": "Go Tell The Bees That I Am Gone: A Novel",
            "author": "Diana Gabaldon",
            "publisher": "Random House Publishing Group",
            "date": "November 23, 2021",
            "website": "https://www.chapters.indigo.ca/en-ca/books/go-tell-the-bees-that/9780385685542-item.html?ikwsec=Home&ikwidx=0#algoliaQueryId=320ae0c1e6b31d3d6ff907b0bc220be1"
        }
    ];

    dbo.collection("customers").insertOne(books, function(err, res) {
        if (err) throw err;
        console.log("5 books inserted");
        db.close();
    });
});