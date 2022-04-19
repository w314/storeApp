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


    async addProduct(orderId: number, productId: number, quantity: number) {
        try {
            const conn = await client.connect()
            const sql = `INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)`
            const result = await conn.query(sql, [orderId, productId, quantity])
            conn.release()
            const orderProductAdded = result.rows[0]
            return orderProductAdded
        } catch (err) {
            throw new Error(`Could not add product to order. Error: ${err}`)
        }
    }
}