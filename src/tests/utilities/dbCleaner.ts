import client from '../../database'



const dbCleaner = async () => {

    const tables = [
        'users',
        'categories',
        'products',
        'orders',
        'order_items'
    ]
    
    // empty database tables
    const conn = await client.connect()
    for (let i = 0; i < tables.length; i++) {
        await conn.query(`TRUNCATE ${tables[i]} RESTART IDENTITY CASCADE`)
    }
    conn.release()
}

export default dbCleaner