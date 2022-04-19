import client from '../../database'



const dbCleaner = async () => {
    const tables = [
        'users',
        'categories',
        'products',
        'orders',
        'order_items'
    ]
    
    // clean database for testing
    const conn = await client.connect()
    // empty tables
    for (let i = 0; i < tables.length; i++) {
        await conn.query(`TRUNCATE ${tables[i]} CASCADE`)
    }
    // for (let table in tables) {
    //     await conn.query(`TRUNCATE ${table} CASCADE`)
    // }
    conn.release()
}

export default dbCleaner