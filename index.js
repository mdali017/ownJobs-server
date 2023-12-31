const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port =  2000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('OwnJob Server Is Running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5julrfk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobsCollection = client.db("ownJob_Portal").collection("all-jobs");
    const compamiesCollection = client.db("ownJob_Portal").collection("company-info");

    // All Job Related Apis
    app.get('/alljobs', async (req, res) =>{
        const result = await jobsCollection.find().toArray();
        res.send(result)
    }) 

    // All Companies Related Apis
    app.get('/allcompanies', async (req, res) => {
        const result = await compamiesCollection.find().toArray();
        res.send(result)
    })

    app.get('/allcompanies/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await compamiesCollection.findOne(query);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () =>{
    console.log(`OwnJob server is Running on Port: ${port}`)
})