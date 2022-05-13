//imports
const express = require('express');
const app = express();
require('dotenv/config');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');



//db
mongoose.connect(process.env.CONNECTION_STRING, {useNewUrlParser: true})
    .then(() => {
        console.log('DB Connected');
    })
    .catch(err => {
        console.log(err);
    });



//middleware
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));



//routes
const api = process.env.API_URL;
app.use(`${api}/products`, productRoutes);
app.use(`${api}/categories`, categoryRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/orders`, orderRoutes);



//listen on port
app.listen(3000, () => {
    console.log(`Server running`)
})