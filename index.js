const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const port = 5000;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xya5g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("easy-bazar").collection("products");
  const ordersCollection = client.db("easy-bazar").collection("orders");

  // perform actions on the collection object
  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    productsCollection.find({ _id: ObjectId(id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  // app.post('/addProducts', (req, res) => {
  //   const products = req.body;
  //   productsCollection.insertMany(products, (err, result) => {
  //     res.send({count: result});
  //   })
  // })
  app.get('/orders', (req, res) => {
    ordersCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  app.get('/order/:email', (req, res) => {
    const email = req.params.email;
    ordersCollection.find({ email: email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.post('/addOrders', (req, res) => {
    const orders = req.body;
    ordersCollection.insertOne(orders, (err, result) => {
      res.send({ count: result.insertedCount });
    })
  })

  app.post('/addNewProduct', (req, res) => {
    const product = req.body;
    productsCollection.insertOne(product, (err, result) => {
      res.send({ count: result.insertedCount });
    })
  })

  app.delete('/deleteProduct/:id', (req, res) => {
    const id = req.params.id;
    productsCollection.deleteOne({_id: ObjectId(id)}, (err) => {
      
    })
  })

  app.delete('/deleteOrder/:id', (req, res) => {
    const id = req.params.id;
    ordersCollection.deleteOne({_id: ObjectId(id)}, (err) => {
      
    })
  })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})