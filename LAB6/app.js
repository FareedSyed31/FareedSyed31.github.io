var express = require('express');
var app = express();

app.use(express.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: false
})); 

var users = [
  {'user':'test'},
  {'user':'test2'},
  {'user':'test3'},
  {'user':'test4'},
  {'user':'test5'},
  {'user':'test6'},
]


app.get('/users/list', function(req, res){

   var html = '<p>'
   for (var i = 0; i < users.length; i++) {
      html = html + users[i].user + '<br>';
    }
    html += '</p>'

   res.send('List of users: ' + html);
});


app.get('/users/add', function(req, res){

  var html = '<br><form action="/users/adduser" method="post"><label for="uname">Username:</label><br><input type="text" id="uname" name="uname"><input type="submit" value="Submit"><br></form>'

  res.send('Insert a user: ' + html);
});

app.post('/users/adduser', function(req, res){

  console.log(req.body);
  var new_user = req.body.uname;

  var new_json = {'user': new_user};
  users.push(new_json);
  res.send('User: ' + new_user + ' is added!<br> <a href="/users/list">list of users</a>');
}

);


app.listen(3000);