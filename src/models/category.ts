import client from '../database'


export type Category = {
    category_id: number;
    category_name: string;
}

export class CategoryStore {
    async create(name: string): Promise<Category> {
        try {
            // console.log(`IN CATEGORY MODEL, category to create: ${name}`)
            const conn = await client.connect()
            const sql = `INSERT INTO categories
                (category_name) VALUES ($1) RETURNING *`
            const result = await conn.query(sql, [name])
            // console.log(`IN CATEGORY MODEL result: ${JSON.stringify(result, null, 4)}`)
            const categoryCreated = result.rows[0]
            conn.release()
            // console.log(`FROM CATEGORY MODEL returning created category:\n ${JSON.stringify(categoryCreated, null, 4)}`)
            return categoryCreated
        } catch (err) {
            console.log(`ERROR IN CATEGORY MODEL: ${err}`)
            throw new Error(`Cannot create category. Error: ${err}`)
        }
    }
}