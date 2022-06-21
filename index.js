const express = require('express');
const database = require('./mysql_');
const port = 5000;
const app = express();
const Sentry = require("@sentry/node");
const mysql = require('mysql');

// Importing @sentry/tracing patches the global hub for tracing to work.
const SentryTracing = require("@sentry/tracing");

Sentry.init({
  dsn: "https://38e5a6e158f94e8ab29caa05103a6951@o1276965.ingest.sentry.io/6474207",
  tracesSampleRate: 1.0,
  integrations: [
      new SentryTracing.Integrations.Mysql()
  ]
});

const transaction = Sentry.startTransaction({
    op: "test",
    name: "My First Test Transaction",
  });
//   Sentry.
  setTimeout(() => {
    try {
      foo();
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      transaction.finish();
    }
  }, 99);

function foo(){
    console.log("hehe");
}

app.use(express.json());
  
app.listen(port, () => {
  console.log(`Server is up and running on ${port}`);
  console.log("Database: ", database['config']['database']);
});

//sample
app.get('', (req, res) =>{
    res.json({message: "ok"});
});

//create database
app.get("/createdb", (req, res) => {
  
    let db_name = database['config']['database'];
    // let p = Promise(function())

    let createQuery = `CREATE DATABASE IF NOT EXISTS ${db_name}`;
  
    // use the query to create a Database.
    database.query(createQuery, (err) => {
        if(err) 
            throw err;
        console.log("Database Created Successfully !");
        res.send(`Created ${db_name} Database`);
    });
});

//use database
app.get("/usedb", (req, res) => {
    let db_name = database['config']['database'];
    let useQuery = `USE ${db_name}`;
    database.query(useQuery, (error) => {
        if(error) 
            throw error;
        console.log("Using Database");
        return res.send(`Using ${db_name} Database`);
    })
});

//create table
app.get('/createtable', (req, res) => {
    let query = 'create table if not exists posts(id int AUTO_INCREMENT, title varchar(255), body varchar(255), primary key (id) )';

    database.query(query, (err, result) => {
        if(err)
            throw err;
        console.log(result);
        res.status(200).send("posts table created..");
    });
});

//add an entry
app.post('/addpost', async (req, res) =>{
        const post = {
            // id: req.body.id,
            title: req.body.title,
            body: req.body.body
        };
    
        try{
            let query = 'insert into posts set ?';
            database.query(query, post, (err, result) => {
                if(err)
                    throw err;
                console.log(result);
                res.json({status:200, message: 'post added'});
            })
        }
        catch (error) {
            console.log("error from", error);
            res.json({
                error: error
            });
        }
});

//select posts
app.get('/getposts', (req, res) =>{
    let query = 'select * from posts';
    database.query(query, (err, result) => {
        if(err)
            throw err;
        console.log(result);
        const results = Object.values(JSON.parse(JSON.stringify(result)));
        res.json(results);
    })
});

//select 1 post
app.get('/getpost/:id', (req, res) =>{
    let query = `select * from postss where id = ${req.params.id}`;
    database.query(query, (err, result) => {
        if(err)
            throw err;
        const results = Object.values(JSON.parse(JSON.stringify(result)));
        res.json(results);
    })
});

//delete a post
app.delete('/delete/:id', (req, res) => {
    let query = `delete from posts where id = ${req.params.id}`;
    database.query(query, (err, result) => {
        if(err)
            throw err;
        console.log(result);
        res.json({message: `deleted post ${req.params.id}`});
    })
});

app.put('/update', (req, res) => {
    let query = `update posts set title = "${req.body.title}", body = "${req.body.body}" where id = ${req.body.id}`;
    database.query(query, (err, result) => {
        if(err)
            throw err;
        console.log(result);
        res.json({message: `Updated post ${req.body.id}`});
    })
});

