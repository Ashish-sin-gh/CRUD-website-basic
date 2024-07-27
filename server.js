const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const mongoClient = require('mongodb').MongoClient;

require('dotenv').config();

const connectingString = process.env.DB_STRING;

mongoClient.connect(connectingString)
    .then(client => {
        console.log('connected to database');
        const db = client.db('star-wars-quotes');
        const quotesCollection = db.collection('quotes');

        app.use(bodyParser.urlencoded({extended: true})); //The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.

        app.use(express.static(__dirname + '/public'));

        app.set('view engine', 'ejs');

        app.get('/',(req, res)=>{
            //console.log(__dirname); // pwd 
            //res.sendFile(__dirname + '/index.html');

            db.collection('quotes')
            .find()
            .toArray()
            .then(result =>{
                res.render('index.ejs', {quotes : result});
                console.log("rendered")
            })
            .catch(error => console.error(error));  
        });
        
        app.post('/quote',(req,res)=>{
            quotesCollection.insertOne({'name': req.body.name , 'quote': req.body.quote, 'likes' : 0})
            .then(result => {
                console.log('document added');
                res.redirect('/');
            })
            .catch(error => console.error(error));
        });
        
        app.listen(3000, (request, response) =>{
            console.log('listening on port 3000');
        });
    })
    .catch(error => console.error(error));