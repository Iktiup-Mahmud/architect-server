const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const colors = require('colors');
const { query } = require('express');
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

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service)
            res.send(result)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
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
            const query = { service: id }
            const cursor = commentsCollection.find(query)
            const selectedComments = await cursor.toArray()
            res.send(selectedComments)
        })


        // app.get('/comments/:email', async (req, res) => {
        //     const id = req.params.email;
        //     console.log(id)
        //     const query = { }
        //     const cursor = commentsCollection.find(query)
        //     const selectedComments = await cursor.toArray()
        //     res.send(selectedComments)
        // })




        // my reviews
        app.get('/reviewsbyuser', async (req, res) => {
            let query = {}
            if(req.query.email){
                query = {
                    email : req.query.email
                }
            }
            const cursor = commentsCollection.find(query) 
            const reviews = await cursor.toArray()
            res.send(reviews)
        })

        app.delete('/reviewsbyuser/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await commentsCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/update/:id', async(req, res) => {
            const id= req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const review = await commentsCollection.findOne(query)
            res.send(review)
        })

        app.put('/update/:id', async(req, res) => {
            const id = req.params.id;
            const filter = { _id : ObjectId(id)}
            const updated = req.body;
            console.log(updated)
            const option = { upsert : true}

            const updatedReview = {
                $set: {
                    comment: updated.review
                }
            }
            const result = await commentsCollection.updateOne(filter, updatedReview, option )
            res.send(result)
        })

        // app.patch('/reviewsbyuser/:id'), async(req, res) => {
        //     const id = req.params.id;
        //     console.log(id)
        //     const newData = req.body.newData
        //     const query = { _id: ObjectId(id) }
        //     const updatedDoc = {
        //         $set:{
        //             data: newData
        //         }
        //     }
        //     const result = await commentsCollection.updateOne(query, updatedDoc);
        //     res.send(result)
        // }

        // app.get('/comments', async (req, res) => {
        //     const uName = req.query.displayName;
        //     console.log(uName)
        //     const query = {}
        //     const cursor = commentsCollection.find(query)
        //     const comments = await cursor.toArray()
        //     res.send(comments)
        // })




    }
    finally {

    }
}

run().catch(error => console.error(error))

app.get('/home', (req, res) => {
    res.send('server is up and running')
})

app.listen(port, () => {
    console.log(`server running on port ${port}`.bgBlue)
}) 