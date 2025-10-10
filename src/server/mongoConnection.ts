import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion} from "mongodb"

dotenv.config();
const uri = `mongodb+srv://${process.env.USERNM}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=myCluster`;

if (!process.env.USERNM || !process.env.PASS || !process.env.HOST) {
    throw new Error("Missing environment variables for MongoDB connection");
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


export default async function MongoConnection() {
    //console.log("Welcome " + process.env.USERNM);
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // Anonymous function will print errors to the console related to that database
        try {
            await client.connect();
            console.log("Connected successfully");
        } catch (err) {
            console.error("Connection error:", err);
            await client.close();
        }


        // Send a ping to confirm a successful connection
        await client.db("myDatabase").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    catch(err){
        console.error("Error during operation:", err);
    }
    return client;
}