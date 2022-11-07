const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const colors = require('colors')
const port = process.env.PORT || 5000;

require('dotenv').config()

app.use(cors())
app.use(express.json())



app.get('/home', (req, res) => {
    res.send('server is up and runnig')
})

app.listen(port, () => {
    console.log(`server running on port ${port}`.bgBlue)
}) 