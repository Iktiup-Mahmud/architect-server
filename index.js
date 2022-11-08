const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const colors = require('colors')
const port = process.env.PORT || 5000;

require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = process.env.URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const servicesCollection = client.db('architect').collection('services')
        const commentsCollection = client.db('architect').collection('comments')

        app.get('/services3', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id : ObjectId(id)}
            const selectedCollection = await servicesCollection.findOne(query)
            res.send(selectedCollection)
        })

        // comments api
        app.post('/comments', async (req, res) => {
            const comment = req.body;
            const result = await commentsCollection.insertOne(comment)
            res.send(result)
        })

        app.get('/comments', async (req, res) => {
            const query = {}
            const cursor = commentsCollection.find(query)
            const comments = await cursor.toArray()
            res.send(comments)
        })

        app.get('/comments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { service : id }
            const cursor = commentsCollection.find(query)
            const selectedComments = await cursor.toArray()
            res.send(selectedComments)
        })

        

    } 
    finally {
        
    }
}

run().catch(error => console.error(error))

app.get('/home', (req, res) => {
    res.send('server is up and runnig')
})

app.listen(port, () => {
    console.log(`server running on port ${port}`.bgBlue)
}) 