const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.json());  //to convert the requests sent in frontend or buffer to json format otherwise requests.json will be null or undefined

app.use(morgan('tiny'));

//routes
const petRoutes = require('./routes/petRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/pets', petRoutes);    //to connect
app.use('/api/category', categoryRoutes);
app.use('/api/adoption', adoptionRoutes); 

const mongodbUri = 'mongodb+srv://preranamp2005:doIeN7wE53KTT3wE@cluster0.dn65d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
});
``;

mongoose.connection.on('connected', () => {
  console.log('Connected to mongodb...');
});

mongoose.connection.on('error', (err) => {
  console.log("Error connecting to mongo", err);
});

app.listen(4001, () => {  //To run in some specified port
  console.log("App is running on PORT 4001");
});