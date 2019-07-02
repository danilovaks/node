let express = require('express'); 
let app = express();

let bodyParser = require('body-parser'); 
let route = require('./routes/products.js');

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(express.static('public')); 

app.use('/products', route);

app.listen(80);
