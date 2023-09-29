const API_SERVER_NAME = 'my-product-api';
const API_PORT = 5000;
const API_HOST = '127.0.0.1';

let GET_REQUEST_COUNT = 0;
let POST_REQUEST_COUNT = 0;

const restifyServer = require('restify');
const ProductsDatabase = require('save')('products');

const apiServer = restifyServer.createServer({
  name: API_SERVER_NAME,
});

apiServer.use(restifyServer.plugins.fullResponse()).use(restifyServer.plugins.bodyParser());

apiServer.get('/products', (request, response, next) => {
  console.log('- GET Products: Received Request');
  GET_REQUEST_COUNT++;

  ProductsDatabase.find({}, (error, products) => {
    console.log(products);
    if (products.length === 0) {
      response.send(204, products);
    } else {
      response.send(200, products);
    }
    console.log('- GET Products: Sending Response');
  });

  console.log('Processed Request Count--> GET: %s, POST: %s', GET_REQUEST_COUNT, POST_REQUEST_COUNT);
});

apiServer.post('/products', (request, response, next) => {
  console.log('- Post Product: Received Request');
  POST_REQUEST_COUNT++;

  const { productCode, productName, productPrice, productQuantity } = request.params;

  if (!productCode || !productName || !productPrice || !productQuantity) {
    return next(new restifyServer.errors.InvalidArgumentError('Missing product details'));
  }

  const product = {
    productCode,
    productName,
    productPrice,
    productQuantity,
  };

  ProductsDatabase.create(product, (error, savedProduct) => {
    if (error) return next(new restifyServer.errors.InvalidArgumentError(JSON.stringify(error.errors)));
    response.send(201, savedProduct);
    console.log('< Products POST: sending response');
  });

  console.log('Processed Request Count--> GET: %s, POST: %s', GET_REQUEST_COUNT, POST_REQUEST_COUNT);
});

apiServer.del('/products', (request, response, next) => {
  ProductsDatabase.deleteMany({}, (error, product) => {
    if (error) return next(new restifyServer.errors.InvalidArgumentError(JSON.stringify(error.errors)));
    response.send();
  });
});

apiServer.listen(API_PORT, API_HOST, () => {
  console.log(`Server ${apiServer.name} listening at ${apiServer.url}`);
  console.log(`Endpoints: ${apiServer.url}/products`);
  console.log('HTTP Methods: GET, POST, DELETE');
});
