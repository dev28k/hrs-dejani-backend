const MongoClient = require('mongodb').MongoClient

// Mongo Connection
// const uri ="mongodb://myUserAdmin:myUserAdmin@localhost:27017/";

const uri ="mongodb+srv://dejaniresort:dejani123@dejanidb.wyltjwu.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const db = client.db("HRS")

module.exports = {client, db}