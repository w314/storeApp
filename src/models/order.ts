import client from './../database'


export type Order = {
    order_id: number,
    user_id: number,
    order_type: string
}

export class OrderStore {

    async create(userId: number ) {
        try {
            const conn = await client.connect()
            const sql = `INSERT INTO orders (user_id, order_type) VALUES ($1, $2)`
            const result = await conn.query(sql, [userId, 'active'])
            conn.release()
            const ceatedOrder = result.rows[0]
            return ceatedOrder
        } catch (err) {
            throw new Error(`Could not create order. Error: ${err}`)
        }
    }

}