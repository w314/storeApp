import express from 'express'

const app: express.Application  = express()
const port: number = 3000

// set up endpoint
app.get('/', (req: express.Request, res: express.Response) => {
    res.send("Application Starting Page")
})

// start server
app.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`)
})