import express from 'express';
import productRoutes from './handlers/product';

const app: express.Application = express();
const port = 3000;

// set up endpoint
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Application Starting Page');
});

productRoutes(app);

// start server
app.listen(port, () => {
  console.log(`Server is listening on localhost:${port}`);
});
