import express from 'express';
import productRoutes from './handlers/product';
import userRoutes from './handlers/user';
import bodyParser from 'body-parser';

const app: express.Application = express();
const port = 3000;

// use bodyParser middleware
app.use(bodyParser.json());

// set up endpoint
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Application Starting Page');
});

productRoutes(app);
userRoutes(app);

// start server
app.listen(port, () => {
  console.log(`Server is listening on localhost:${port}`);
});


export default app