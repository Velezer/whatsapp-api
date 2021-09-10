const { MongoClient } = require('mongodb');
const process = require('process')
require('dotenv').config()


const uri = process.env.DB_URI_CLOUD



class DatabaseMongo {
    /**
     * 
     * @param {number} connections_amount 
     */
    constructor(connections_amount) {
        this.pool = []
        for (let i = 0; i < connections_amount; i++) {
            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            client.connect().then(() => this.pool.push(client))
        }

    }

    getConnection() {
        return this.pool.pop()
    }

    done(connection) {
        this.pool.push(connection)
    }
}


// client.connect(async err => {
//     if (err) console.log(err)
//     else console.log(`connection success`)
//     const collection = client.db("kreblast").collection("session");
//     await collection.insertOne({ session_id: 1 }).then(res => console.log(res)).catch(err => console.log(err))
//     // client.close();
// });

// client.connect(async err => {
//     if (err) console.log(err)
//     else console.log(`connection success`)
//     const collection = client.db("kreblast").collection("session");
//     await collection.find().toArray().then(res => console.log(res))
//     client.close();
// });


module.exports = { DatabaseMongo }