const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const mongoClient = require('mongodb').MongoClient;

const connectingString = "mongodb+srv://Ashish:Ashish123%40@cluster0.vifg5u7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";



mongoClient.connect(connectingString)
    .then(client => {
        console.log('connected to database');
        const db = client.db('star-wars-quotes');
        const quotesCollection = db.collection('quotes');

        app.use(bodyParser.urlencoded({extended: true})); //The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.

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
            quotesCollection.insertOne(req.body)
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