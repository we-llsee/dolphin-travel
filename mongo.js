const {MongoClient} = require('mongodb');

require('dotenv').config({
    path:`${__dirname}/dev.env`
});

const MONGO_PW= process.env.MONGO_PW;

const uri = `mongodb+srv://testuser:${MONGO_PW}@test.tqgebtp.mongodb.net/?retryWrites=true&w=majority`

function main() {
    
    console.log(MONGO_PW)
    const client = new MongoClient(uri);
    
    client.connect().then(()=>{
        console.log('success');
        listDatabases(client).then((listDbs)=>{
            console.log('List of Dbs:')
            listDbs.databases.forEach(db => {
                console.log(` - ${db.name}`)
            })
        }).then(()=>{
            return createListing(client,
                {
                    name:"DOLPHIN123",
                    summary:"DOLPHIN123",
                    bedrooms:1,
                    bathrooms:1
                })
        }).then((listing)=>{
            console.log(`you just inserted ${listing.insertedId}`)
            return client.close();
        })
    })
}

function listDatabases(client){
    return client.db().admin().listDatabases();
}

function createListing(client,listing){
    return client.db("sample_airbnb").collection("listingsAndReviews").insertOne(listing);
}

main();