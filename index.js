const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleWire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvhfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected to database');
        const database = client.db('holidays');
        const packagesCollection = database.collection('packages');
        const ordersCollection = database.collection('orders');

        //POST API ...... insert to database
        app.post('/packages', async (req,res) => {
            const pac= req.body;
            const result= await packagesCollection.insertOne(pac);
            res.send(result);
        });
        
        //GET API ....... load from database
        app.get('/packages', async(req,res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running holidays server');
});

app.listen(port, () => {
    console.log('running port ', port)
})