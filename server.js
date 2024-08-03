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

        app.use(express.urlencoded({extended: true})); 

        app.use(express.static(__dirname + '/public')); // serve static files

        app.use(express.json());

        app.set('view engine', 'ejs'); // sets the view engine as .ejs file. this helps make the page dynamic as the ejs placeholders get data real time and render it on the web page.  

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

        app.put('/addLike',(req,res)=>{
            console.log(req.body);
        });

         app.delete('/delete', (req,res)=>{
            console.log(req.body);
            db.collection('quotes').deleteOne({name : req.body.nameQ})
            .then (result =>{
                console.log(' rapper deleted');
                res.json('rapper deleted');
            })
            .catch(err => console.error(err));
         });   

        app.listen(3000, (request, response) =>{
            console.log('listening on port 3000');
        });
    })
    .catch(error => console.error(error));