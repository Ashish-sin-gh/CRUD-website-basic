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
            .sort({likes : -1})
            .toArray()
            .then(result =>{
                res.render('index.ejs', {quotes : result});
                console.log("rendered")
            })
            .catch(error => console.error(error));  
        });
        
        app.post('/quote',(req,res)=>{
            let q = req.body.quote;
            let n = req.body.name; 
            while(q.charAt(q.length-1) === " "){
                if(q && q.charAt(q.length-1) === " "){
                    q = q.substring(0, q.length - 1);
                }
            }
            while (n.charAt(n.length-1) === " "){
                if(n && n.charAt(n.length-1) === " "){
                    n = n.substring(0, n.length - 1);
                }
            }
           
            if(!n || !q){
                return console.log('no value entered');
            }

            quotesCollection.insertOne({'name': n , 'quote': q, 'likes' : 0})
            .then(result => {
                console.log('document added');
                res.redirect('/');
            })
            .catch(error => console.error(error));
        });

        app.put('/addLike',(req,res)=>{
            
            console.log(req.body);

            db.collection('quotes').updateOne({
                name : req.body.nameIs,
                quote : req.body.quoteIs,
                likes : req.body.likeIs
            },
            {
                $set : {
                    likes : req.body.likeIs + 1
                }
            },
            {
                sort: {likes: -1}, //sort by decending order
                //upsert: true  // if data is not present add the data to DB
            })
            .then(result =>{
                console.log(result);

                if (result.modifiedCount === 1) {
                    console.log('Like added');
                    res.json('Like added');
                } else {
                    console.log('No documents matched the query. No like added.');
                    res.json('No documents matched the query. No like added.');
                }
            })
            .catch(err => console.error(err));
        });

         app.delete('/delete', (req,res)=>{

            console.log(req.body);
            
            db.collection('quotes').deleteOne({
                name : req.body.nameD,
                quote : req.body.quoteD,
                likes : req.body.likeD
            })
            .then (result =>{
                console.log(result);

                if (result.deletedCount === 1) {
                    console.log('Document deleted successfully');
                    res.json('Document deleted successfully');
                } else {
                    console.log('No documents matched the query. Deleted 0 documents.');
                    res.json('No documents matched the query. Deleted 0 documents.');
                }
            })
            .catch(err => console.error(err));
         });   

        app.listen(3000, (request, response) =>{
            console.log('listening on port 3000');
        });
    })
    .catch(error => console.error(error));