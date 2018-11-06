var express = require('express');
var cons = require('consolidate');  // npm install consolidate
var bodyParser = require('body-parser');
var customerController = require('./customerController');
var path = require('path');
var session = require('express-session'); // npm install express-session

var app=express();

// npm install handlebars
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

const http = require('http');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))

// Staattiset filut
//app.use(express.static('public'));

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
app.post('/login', function(req, res){
    console.log('/login: data=' + JSON.stringify(req.body));
    let username = req.body.tunnus;
    let password = req.body.ss;

    if ( username == "kalle" && password == "xx" )
    {
        req.session.username = username;
        res.redirect('/client');
    }
    else
    {
        /* Voidaan tehdä näin, mutta silloin url:ssa näkyy reittinä /login -> ei välttämättä haluta
        res.render('login', {
            message: 'Virheellinen käyttäjätunnus tai salasana',
        });*/        
    
        // Välitetään data query-parametrissa 
        // Toinen vaihtoehto olisi tallettaa data sessioon -> parempi vaihtoehto niin ei käyttäjä näe url:ssa dataa ...
        res.redirect('/?message=Virheellinen käyttäjätunnus tai salasana');
    }
});

app.get('/client', function(req,res){

    res.sendFile(path.join(__dirname + '/views/client.html'));
});

app.get('/', function(req,res){

    let msg = 'Tervetuloa sovellukseen X';

    if ( req.query.message )
        msg = req.query.message;

    res.render('login', {
        message: msg,
    });        

    // Tämäkin toimii, mutta tässä koodissa login.html-sivulle EI voi viedä mitään dataa
    //res.sendFile(path.join(__dirname + '/login.html'));

    //res.sendFile(path.join(__dirname + '/views/index.html'));

});

// REST API Asiakas
app.route('/Types')
    .get(customerController.fetchTypes);

app.route('/Asiakas')
    .get(customerController.fetchAll)
    .post(customerController.create);

app.route('/Asiakas/:id')
    .put(customerController.update)
    .delete(customerController.delete)
    .get(customerController.fetchOne);
//

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});

/*
app.listen(port, () => {
    console.log(`Server running AT http://${port}/`);
  });
*/  