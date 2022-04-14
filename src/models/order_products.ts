import client from './../database'

export type OrderProduct = {
    order_id: number,
    product_id: number,
    quantity: number
}


export class OrderProductStore {
    async create(orderId: number, productId: number, quantity: number): Promise<OrderProduct> {
        try {
            const conn = await client.connect()
            const sql = `INSERT INTO order_products 
                (product_id, order_id, quantity)
                VALUES ($1, $2, $3)`
            const result = await conn.query(sql, [orderId, productId, quantity])
            const createdOrderProduct = result.rows[0]
            return createdOrderProduct    
        } catch (err) {
            throw new Error(`Could not add product to order_products. Error: ${err}`)
        }
    }
}