import client from '../database'


export type Category = {
    category_id: number;
    name: string;
}

export class CategoryStore {
    async create(name: string): Promise<Category> {
        try {
            const conn = await client.connect()
            const sql = `INSERT INTO categories
                (name) VALUES ($1)`
            const result = await conn.query(sql, [name])
            const categoryCreated = result.rows[0]
            conn.release()
            return categoryCreated
        } catch (err) {
            throw new Error(`Cannot create category. Error: ${err}`)
        }
    }
}