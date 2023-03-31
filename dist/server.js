"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("./routes/product"));
const user_1 = __importDefault(require("./routes/user"));
// import bodyParser, an HTTP request body parser middleware
const body_parser_1 = __importDefault(require("body-parser"));
// import morgan, a HTTP request logging middleware
const morgan_1 = __importDefault(require("morgan"));
const order_1 = __importDefault(require("./routes/order"));
const cors_1 = __importDefault(require("cors"));
// app returned by express is a javaScript function
// designed to be passed to Node's HTTP server
// to handle requests
const app = (0, express_1.default)();
const port = 3001;
// middlewares
app.use((0, cors_1.default)());
// log HTTP requests
app.use((0, morgan_1.default)('dev'));
// parse HTTP request bodies
app.use(body_parser_1.default.json());
// map incoming requests to endpoints
// app.get('/', (req: express.Request, res: express.Response) => {
//   res.send('Application Starting Page');
// });
// pass our express app to our routes
(0, user_1.default)(app);
(0, product_1.default)(app);
(0, order_1.default)(app);
// start server, app.listen returns an http.Server object
app.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`);
});
exports.default = app;
