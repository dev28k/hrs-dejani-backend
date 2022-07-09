const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const multer = require('./lib/multer');
const fs = require('fs');
const bcrypt = require('./lib/bcrypt');
const mongoConfig = require('./lib/mongoConfig');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
// const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express()

app.use(cors())
// for parsing application/json
app.use(
   bodyParser.json({
       limit: "50mb",
   })
);
// for parsing application/xwww-form-urlencoded
app.use(
   bodyParser.urlencoded({
       limit: "50mb",
       extended: true,
   })
);

console.log(__dirname)

app.use('/img', express.static(__dirname + '/public/upload/Images'))
app.use('/vid', express.static(__dirname + '/public/upload/Videos'))

const db = mongoConfig.db;

app.get('/', async function (req, res) {
    var dateTime = new Date();
    try {
      await mongoConfig.client.connect();
      res.send("Hotel Reservation API"+" "+dateTime+"\n"+JSON.stringify(db.s.namespace))
    }catch (err) {
      res.send("Connection Error")
    }
})

app.post('/register', async function (req, res) {
   //  console.log(req.body)
 
    const pass = await bcrypt.hashing(req.body.password);
    console.log(pass);
 
   try { 
      await mongoConfig.client.connect();
      var dateTime = new Date();
      var myobj = {     
         _id: mongoose.Schema.Types.ObjectId,
         name: req.body.name,
         email: req.body.email,
         password: pass,
         dateTime: dateTime.toString() 
      };
      db.collection("user").insertOne(myobj, function(err) {
         if (err) throw err;
         console.log("1 document inserted");
         res.sendStatus(200);
      });
   } catch(err) {
      console.log(err)
   }
})

app.post('/login', async function (req, res) {
    // console.log(req.query)
 
    var myobj = { email: req.body.email }
 
    await mongoConfig.client.connect();
    db.collection("user").findOne(myobj, async function (err, result) {
         if (err) throw err
 
         if(result == null) {
            res.send("UserNotFound")
         }
         else {
          console.log("result", result)
 
          const comparedPassword =  await bcrypt.comparing(req.body.password, result.password);
          console.log(comparedPassword);
  
          if(comparedPassword == true) {
           res.sendStatus(200)
          }
          else {
            res.sendStatus(201)
          }
         }
       })
})

 app.post('/roomInesrt', multer.upload.single("image"), async function (req, res) {
    // console.log(req.file);
    // console.log(req.body.class)

    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
 
    await mongoConfig.client.connect();
    var dateTime = new Date();
    var myobj = {     
       _id: mongoose.Schema.Types.ObjectId,
       class: req.body.class,
       beds: req.body.beds,
       capacity: req.body.capacity,
       services: req.body.services,
       fare: req.body.fare,
       description: req.body.description,
       imageLink: encode_img,
       dateTime: dateTime.toString()
    };
 
    // console.log(myobj)
    db.collection("Rooms").insertOne(myobj, function(err) {
       if (err) throw err;
       console.log("Doc Inserted");
       res.sendStatus(200);
    });
})

 app.get('/RoomList', async function (req, res) {
   try
   { await mongoConfig.client.connect();
    // const collection = db.collection('Patients');
     // console.log(myobj)
 
    db.collection("Rooms").find().toArray(function(err, result) {
       if (err) throw err;
       console.log(result);
       res.send(result)
     });
   }catch(err) {
      console.log(err)
   }
})

// DELETE Room
app.post('/deleteRoom', async function (req, res) {
    var myobj = {
       _id: ObjectId(req.body.Id),
    }

    // console.log(myobj)
    await mongoConfig.client.connect();
    db.collection("Rooms").deleteOne(myobj, function(err, obj) {
       if (err) throw err;
       console.log("1 document deleted");
        res.sendStatus(200)
     });
})

app.post('/videoUpload', multer.uploadVid.single("video"), async function (req, res) {
   // console.log(req.file)
   // res.send(req.file)

   // var img = fs.readFileSync(req.file.path);
   // var encode_vid = img.toString('base64');

   await mongoConfig.client.connect();
   var dateTime = new Date();
   var myobj = {     
      _id: mongoose.Schema.Types.ObjectId,
      imageLink: req.file.path,
      dateTime: dateTime.toString()
   };

   // console.log(myobj)
   await db.collection("Videos").deleteMany({});
   await db.collection("Videos").insertOne(myobj, function(err) {
      if (err) throw err;
      console.log("Doc Inserted");
      res.sendStatus(200);
   });
})

app.get('/video', async function (req, res) {
   await mongoConfig.client.connect();

   db.collection("Videos").find().toArray(function(err, result) {
      if (err) throw err;
      // console.log(result);
      res.send(result)
    });
})

app.post('/ImageUpload', multer.upload.single("image"), async function (req, res) {
   // console.log(req.body)
   // res.send(req.file)

   await mongoConfig.client.connect();
   var dateTime = new Date();
   var myobj = { $set: {     
      imageLink: req.file.path,
      dateTime: dateTime.toString()
   }};
   var myquery = { _id: ObjectId(req.body.id) };

   console.log(myquery)
   await db.collection("Images").updateOne(myquery, myobj, function(err) {
      if (err) throw err;
      console.log("Doc Updated");
      res.sendStatus(200);
   });
})

app.get('/sliderImages', async function (req, res) {
   await mongoConfig.client.connect();

   db.collection("Images").find().toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result)
    });
})


var server = app.listen(process.env.PORT || 8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
})