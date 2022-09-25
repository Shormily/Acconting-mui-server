const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const objectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qqdu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// console.log(uri)

async function run() {
  try {
    await client.connect();
    const database = client.db("Accounting");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");

    // Add Orders API
    app.get('/orders',async (req,res)=>{
      let query = {};
      const email = req.query.email;
      if(email){
        query={email:email};
      }
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    })
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    // Delete API Orders
    app.delete('/orders/:id',async(req,res)=>{
      const id = req.params.id;
      const query ={_id:objectId(id)};
      console.log(id);
      const result = await orderCollection.deleteOne(query);
      console.log("deleting user with id",result);
      res.json(result);
     })
    // GET PROJECTS API
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const user = await productCollection.findOne(query);
      // console.log('loaduser with id',id);
      res.send(user);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);
// console.log(uri);

app.get("/", (req, res) => {
  res.send("Hello Doctors PORTAL!");
});

app.listen(port, () => {
  console.log(` listening at ${port}`);
});
