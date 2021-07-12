const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000;
require('dotenv').config();

//process.env.DB_USER
const DB_USER = 'volunteerDB';
const DB_PASS = 'volunteer123DB';
const DB_NAME = 'volunteerDB';


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
//file upload



//MongoDB
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.4zce5.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db("volunteerDB").collection("events");
  const eventsRegister = client.db("volunteerDB").collection("registers");

    //add Events
    app.post('/addEvents', (req,res)=>{
        const events = req.body;
        console.log(events);
        eventsCollection.insertOne(events)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0)
        })

    });

    //Register events in User
    app.post('/registerEvents',(req,res)=> {
        const registerEvents = req.body;
        eventsRegister.insertOne(registerEvents)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

    //get Register Event list in User
    app.get('/getRegisterEvents',(req,res)=> {
        eventsRegister.find({})
        .toArray((err,documents) => {
            res.send(documents)
        })
    })

    //Get register list in Admin
    app.get('/getRegisterList',(req,res)=> {
        eventsRegister.find({})
        .toArray((err,documents) => {
            res.send(documents)
        })
    })
    //getEvents in Home page
    app.get('/getEvents',(req,res) => {
        eventsCollection.find({})
        .toArray((err,documents) => {
            res.send(documents);
        })
    })

    console.log('Database Connected...');
});




app.get('/',(req,res)=> {
    res.send('Hello Volunteer Network server...')
});
app.listen(port, ()=> {
    console.log(`Server is running port of ${port}`)
})