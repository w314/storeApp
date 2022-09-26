import express from 'express';
import productRoutes from './handlers/product';
import userRoutes from './handlers/user';
// import bodyParser, an HTTP request body parser middleware
import bodyParser from 'body-parser';
// import morgan, a HTTP request logging middleware
import morgan from 'morgan'
import orderRoutes from './handlers/order';

const app: express.Application = express();
const port = 3001;


// middlewares

// log HTTP requests
app.use(morgan('dev'))
// parse HTTP request bodies
app.use(bodyParser.json());


// set up endpoint
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Application Starting Page');
});

productRoutes(app);
userRoutes(app);
orderRoutes(app);

// start server
app.listen(port, () => {
  console.log(`Server is listening on localhost:${port}`);
});


export default app