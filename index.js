const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mostakinahamed.fo1obhn.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const allServices = client.db('ToolShare').collection('AllServices')

    const bookServices = client.db('ToolShare').collection('Bookings')

    app.get('/services', async(req,res)=>{
        const cursor = allServices.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/singleService/:id',async(req, res)=>{
        const id= req.params.id;
        const query ={_id: new ObjectId(id)}
        const result = await allServices.findOne(query);
        res.send(result)
    })

    app.get('/myServices', async(req, res)=>{
      const email= req.query.email;
      let query = {};
      if(req.query?.email){
        query = { providerEmail: email}
      }
      const result = await allServices.find(query).toArray();
      res.send(result)
    })
    app.get('/mySchedules', async(req, res)=>{
      const email= req.query.email;
      let query = {};
      if(req.query?.email){
        query = { userEmail: email}
      }
      const result = await bookServices.find(query).toArray();
      res.send(result)
    })

    app.post('/addService', async(req, res)=>{
      const newService = req.body;
      const result = await allServices.insertOne(newService)
      res.send(result)
    })


    

    app.put('/update/:id', async(req, res)=>{
      const id=req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options ={upsert: true};
      const updateService = req.body;
      const service ={
        $set:{
          name: updateService.name,
          image: updateService.image,
          price: updateService.price,
          description: updateService.description,
          serviceArea: updateService.serviceArea
        }
      }
      const result = await allServices.updateOne(filter, service, options)
      res.send(result)
    })

    app.post('/bookItems', async(req, res)=>{
      const booking = req.body;
      const result = await bookServices.insertOne(booking)
      res.send(result)
    })

    app.delete('/myServices/:id', async(req, res)=>{
      const id=req.params.id;
      const query = {_id:new ObjectId(id) };
      const result = await allServices.deleteOne(query);
      res.send(result)
    })

    


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/',(req, res)=>{
    res.send('Tool share server is running')
})

app.listen(port, ()=>{
    console.log(`Tool share server is running on port ${port}`);
})