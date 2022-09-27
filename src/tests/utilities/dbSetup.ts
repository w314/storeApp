// import database client
import client from '../../database'
// Import User Model
import { User } from '../../models/user'
// import { Category } from '../../models/category'
// import { Product } from '../../models/product'
// import { Order, OrderItem, OrderStore } from '../../models/order'
// import dotenv for using environmental variables
import dotenv from 'dotenv'
// for hashing password when creating new users
import bcrypt from 'bcrypt'
import dbCleaner from './dbCleaner'
// import { userInfo } from 'os'

// get environmental variables
dotenv.config()
const {
    PEPPER,
    SALT_ROUNDS,
    TOKEN_SECRET
} = process.env

export class DbSetup {


    // tables will be created with data in arrays below

    users: User[] = [
        { id: 1, username: 'admin', firstname: 'Ed', lastname: 'Mint', 
          password: 'difficult', user_type: 'admin' },
       {  id: 2, username: 'bob', firstname: 'bob', lastname: 'bobek',
          password: '1234', user_type: 'regular' }
    ]

    /*
        Creates two users an admin and a regular. 
        Uses admin user to create one active order
        Regular user will only have completed orders.
        Regular user can be used in tests to create active order.
    */
    // administrator
    admin : User = this.users.filter(function(user) { return user.user_type == 'admin'})[0]
    // regular user
    user: User = this.users.filter(function(user) { return user.user_type == 'regular'})[0]


    // categories: Category[] = [
    //     { category_id: 1, category_name: 'Books' },
    //     { category_id: 2, category_name: 'Electronics' },
    //     { category_id: 3, category_name: 'Clothing' },
    //     { category_id: 4, category_name: 'Garden & Outdoors' },
    //     { category_id: 5, category_name: 'Appliances' },
    //     { category_id: 6, category_name: 'Pet Supplies' },
    //     { category_id: 7, category_name: 'Home & Kitchen' },
    // ]

    // products: Product[] = [
    //     { product_id: 1, name: 'Foundation', price: 9.98, category_id: 1 },
    //     { product_id: 2, name: 'Hitchhiker\'s Guide to the Galaxy', price: 42, category_id: 1 },
    //     { product_id: 3, name: 'Dishwasher', price: 462, category_id: 5 },
    //     { product_id: 4, name: 'Leash', price: 12, category_id: 6 },
    //     { product_id: 5, name: 'Hoe', price: 92.98, category_id: 4 }
    // ]

    // orders: Order[] = [
    //     { order_id: 1, user_id: 1, order_status: 'completed' },
    //     { order_id: 2, user_id: 1, order_status: 'completed' },
    //     { order_id: 3, user_id: 2, order_status: 'completed' },
    //     { order_id: 4, user_id: 2, order_status: 'completed' },
    //     { order_id: 5, user_id: 2, order_status: 'completed' },
    //     { order_id: 6, user_id: this.admin.user_id, order_status: 'active'}
    // ]


    // // the variables below are used in specs

    // // variable for an active order
    // activeOrder = this.orders.filter(function(order) { return order.order_status == 'active' })[0]
    // // variable for a completed order
    // completedOrder = this.orders.filter(function(order) { return order.order_status == 'completed' })[0]

    // // function to filter order id's of completed orders created by dbSetup.user
    // isCompletedByUser = (order: Order) => {
    //     if ( order.order_status == 'completed' && order.user_id == this.user.user_id ) {
    //         return order.order_id
    //     }
    //     return false
    // }
    // // set of orderId of completed orders created by dbSetup.user
    // completedOrderIdsOfUser = new Set(this.orders.filter(this.isCompletedByUser).map(order => order.order_id))
    

    // orderItems: OrderItem[] = [
    //     { item_id: 1, order_id: 1, product_id: 2, quantity: 12 },
    //     { item_id: 2, order_id: 2, product_id: 1, quantity: 2 },
    //     { item_id: 3, order_id: 2, product_id: 2, quantity: 112 },
    //     { item_id: 4, order_id: 3, product_id: 1, quantity: 1 },
    //     { item_id: 5, order_id: 3, product_id: 2, quantity: 2 },
    //     { item_id: 6, order_id: 3, product_id: 3, quantity: 9 },
    //     { item_id: 7, order_id: 4, product_id: 2, quantity: 7 },
    //     { item_id: 8, order_id: 4, product_id: 3, quantity: 6 },
    //     { item_id: 9, order_id: 4, product_id: 1, quantity: 4 },
    //     { item_id: 10, order_id: 5, product_id: 2, quantity: 13 },
    //     { item_id: 11, order_id: 5, product_id: 3, quantity: 78 },
    //     { item_id: 12, order_id: 5, product_id: 4, quantity: 4 },
    //     { item_id: 13, order_id: 5, product_id: 5, quantity: 3 },
    //     { item_id: 14, order_id: 5, product_id: 1, quantity: 1 },
    //     { item_id: 15, order_id: this.activeOrder.order_id, product_id: 3, quantity: 2 },
    //     { item_id: 16, order_id: this.activeOrder.order_id, product_id: 5, quantity: 7 },
    // ]


    // // the variables below are used in specs

    // // count of all the items in the only active order in the dataset
    // numberOfItemsInActiveOrder = this.orderItems.reduce(
    //     (total, currentItem) => 
    //     currentItem.order_id == this.activeOrder.order_id ? total + 1 : total,
    //     0)

    // // count of all items in all the order completed by the regular user (user)
    // numberOfItemsInCompletedOrdersOfUser = this.orderItems.reduce(
    //     (total, currentItem) => 
    //     this.completedOrderIdsOfUser.has(currentItem.order_id) ? total + 1 : total,
    //     0)


    // this function enter all data from arrays into the appropriate tables    
    setup = async () => {

        try {
            // clear tables in database
            await dbCleaner()

            // connect to database
            const conn = await client.connect()

        // add users
        this.users.forEach(async(user) => {
            const hash = bcrypt.hashSync(
                user.password + PEPPER,
                parseInt(SALT_ROUNDS as string)
            )
            
            console.log(`Inserting user: ${JSON.stringify(user, null, 4)}`)
            await conn.query(`INSERT INTO users
                (username, firstname, lastname, password, user_type)
                VALUES ($1, $2, $3, $4, $5)`,
                [user.username, user.firstname, user.lastname, hash, user.user_type ]
            )
        })
   

            // // add categories
            // for (let i = 0; i < this.categories.length; i++) {
            //     await conn.query(`INSERT INTO categories 
            //         (category_name)
            //         VALUES ($1)`,
            //         [this.categories[i].category_name])
            // }
            
    
    
            // // add products
            // for (let i = 0; i < this.products.length; i++) {
            //     await conn.query(`INSERT INTO products
            //     (name, price, category_id )
            //     VALUES ($1, $2, $3)`,
            //     [this.products[i].name, this.products[i].price, this.products[i].category_id])
            // }
    
            // // add orders
            // for (let i = 0; i < this.orders.length; i++) {
            //     await conn.query(`INSERT INTO orders
            //     (user_id, order_status)
            //     VALUES ($1, $2)`,
            //     [this.orders[i].user_id, this.orders[i].order_status])
            // }
    
            // // add order_items
            // for (let i = 0; i < this.orderItems.length; i++) {
            //     await conn.query(`INSERT INTO order_items
            //     (order_id, product_id, quantity)
            //     VALUES ($1, $2, $3)`,
            //     [this.orderItems[i].order_id, this.orderItems[i].product_id, this.orderItems[i].quantity])
            // }

            // disconnect from database
            conn.release()     
            return 

        } catch (err) {
            console.log(err)
            throw new Error(`Error setting up database for testing. Error: ${err}`)
        }

    }
}