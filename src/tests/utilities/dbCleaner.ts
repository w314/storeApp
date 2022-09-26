// import database client
import client from '../../database'


// create dbCleaner function
const dbCleaner = async () => {

    // create array of all tables in database
    const tables = [
        'users',
        'categories',
        'products',
        'orders',
        'order_items'
    ]
    
    try {
        // connect to database
        const conn = await client.connect()

        // delete content of each table in our tables array
        // and reset the primary keys
        tables.forEach(async (table) => {
            await conn.query(`TRUNCATE ${table} RESTART IDENTITY CASCADE`)
        })

        // disconnect from database
        conn.release()
        
    } catch(err) {
        // throw error if could not connect to database
        throw new Error(`Could not connect to database: ${err}`)
    }
}

export default dbCleaner