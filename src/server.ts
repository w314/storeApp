import express from 'express';
import productRoutes from './routes/product';
import userRoutes from './routes/user';
// import bodyParser, an HTTP request body parser middleware
import bodyParser from 'body-parser';
// import morgan, a HTTP request logging middleware
import morgan from 'morgan';
import orderRoutes from './routes/order';
import cors from 'cors'

// create express object app
// it enables us to use express methods
const app: express.Application = express();
const port = 3001;

// middlewares

app.use(cors())
// log HTTP requests
app.use(morgan('dev'));
// parse HTTP request bodies
app.use(bodyParser.json());

// map incoming requests to endpoints
// app.get('/', (req: express.Request, res: express.Response) => {
//   res.send('Application Starting Page');
// });

// pass our express app to our routes
userRoutes(app);
productRoutes(app);
orderRoutes(app);

// start server
app.listen(port, () => {
  console.log(`Server is listening on localhost:${port}`);
});

export default app;
