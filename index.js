const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const colors = require('colors')
const port = process.env.PORT || 5000;

require('dotenv').config()

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const servicesCollection = client.db('gotrip').collection('services')

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
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