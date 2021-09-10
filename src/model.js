const { MongoClient } = require('mongodb');
const process = require('process')
require('dotenv').config()


const uri = process.env.DB_URI_CLOUD



class DatabaseMongo {
    /**
     * 
     * @param {number} max_connections_amount 
     */
    constructor(max_connections_amount = 10) {
        this.max_connections_amount = max_connections_amount
        this.pool = []
        this.createConnection(this.max_connections_amount)
    }
    /**
     * 
     * @param {number} connections_amount 
     */
    async createConnection(connections_amount) {
        for (let i = 0; i < connections_amount; i++) {
            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect()
                .then(() => this.pool.push(client))
                .catch(() => this.createConnection(1))
            // client.db().collection().findOne()
        }
    }

    async getConnection() {
        if (this.pool.length == 0) {
            await this.createConnection(1)
                .catch((err) => console.error(err))
        }
        let connection = this.pool.pop()
        console.log(`conection_______---___` + connection)
        return connection
    }


    done(connection) {
        if (this.pool.length == this.max_connections_amount) {
            connection.close()
        } else {
            this.pool.push(connection)
        }
    }
}


class SessionModel {
    constructor(db) {
        this.db = db
        this.dbName = 'kreblast'
        this.collname = 'session'
    }

    collection(connection) {
        return connection.db(this.dbName).collection(this.collname);
    }

    async save(sessionCfg) {
        const connection = await this.db.getConnection()
        const collection = this.collection(connection)
        const res = await collection.insertOne(sessionCfg)
        this.db.done(connection)
        return res
    }

    async findOne(id) {
        console.log(`db_is_______${this.db}`)
        const connection = await this.db.getConnection()
        const collection = this.collection(connection)
        console.log(`collection_is________${collection}`)
        let result = null
        await collection.findOne({ _id: id }).then(res => {
            console.log(`res_is________${res}`)
            result = res
        }).catch((err) => console.error(err))
        console.log(`result_is________${result}`)

        this.db.done(connection)
        return result
    }

}

module.exports = { SessionModel, DatabaseMongo }