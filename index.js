const SERVER_NAME = 'product-api';
const PORT = 5000;
const HOST = '127.0.0.1';

var COUNTER_GET = 0;
var COUNTER_POST = 0;

var restify = require('restify')

    // Get a persistence engine for the products
    , ProductsSave = require('save')('products')

    // Create the restify server
    , server = restify.createServer({name: SERVER_NAME})

server.listen(PORT, HOST, function () {
    console.log('Server %s listening at %s', server.name, server.url)
    console.log('Endpoints: %s/products', server.url)
    console.log('Method: GET, POST,Delete')
    console.log('test')

})

server.use(restify.fullResponse()).use(restify.bodyParser())

// Get all products
server.get('/products', function (req, res, next) {
    console.log('- GET Products: Received Request')
    COUNTER_GET++;

    ProductsSave.find({}, function (error, products) {
        console.log(products)
        if(products.length === 0){
            res.send(204,products)
        } else {
            res.send(200,products)
        }
        console.log('- GET Products: Sending Response')
    })

    console.log('Processed Request Count--> GET: %s, POST: %s', COUNTER_GET, COUNTER_POST)
})


//Create Product
server.post('/products', function (req, res, next) {
    console.log('- Post Product: Received Request')
    COUNTER_POST++;

    if (req.params.productId === undefined) {
        return next(new restify.InvalidArgumentError('ProductID Missing'))
    }
    if (req.params.name === undefined) {
        return next(new restify.InvalidArgumentError('Product Name Missing'))
    }
    if (req.params.price === undefined) {
        return next(new restify.InvalidArgumentError('Product Price Missing'))
    }
    if (req.params.quantity === undefined) {
        return next(new restify.InvalidArgumentError('Product quantity Missing'))
    }
    var product = {
        productId: req.params.productId,
        name: req.params.name,
        price: req.params.price,
        quantity: req.params.quantity
    }

    // Create product
    ProductsSave.create(product, function (error, product) {
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
        res.send(201, product)
        console.log('< Products POST: sending response')
    })
    console.log('Processed Request Count--> GET: %s, POST: %s', COUNTER_GET, COUNTER_POST)
})

// Delete all products
server.del('/products', function (req, res, next) {
    ProductsSave.deleteMany({}, function (error, product) {
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
        res.send()
    })
})
