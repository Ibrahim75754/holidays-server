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

        // ...... 
        //POST api .............. insert one
        app.post('/packages', async (req,res) => {
            const pac= req.body;
            const result= await packagesCollection.insertOne(pac);
            res.send(result);
        });
        // Get Api ................ get all collection
        app.get('/packages', async(req,res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });
        //GET single Package API........show one
        app.get('/packages/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packagesCollection.findOne(query);
            res.json(package);
        });
        //update package........... update one
        app.put('/packages/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatePackage = req.body;
            console.log(updatePackage);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    img: updatePackage.img,
                    name: updatePackage.name,
                    description: updatePackage.description,
                    price: updatePackage.price,
                    duration: updatePackage.duration,
                },
            };
            const result = await packagesCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        //delete from package............ delete one
        app.delete('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packagesCollection.deleteOne(query);
            res.json(result);
        });

        //...
        //insert orders
        app.post('/placeOrder', async (req,res) => {
            const order= req.body;
            const result= await ordersCollection.insertOne(order);
            res.send(result);
        });
    
        app.get('/myOrders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        });

        //delete from Orders
        app.delete('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
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