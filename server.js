// Check if we are running in the dev or local
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

// Import Index Router
const indexRouter = require('./routers/index');
const officeRouter = require('./routers/offices');
const gradeRouter = require('./routers/grades');

// Setting View Engine To Be EJS
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.set('layout', 'layouts/layout');

// Middleware
// using express-ejs-layouts
app.use(expressLayouts);
// Using body-parser
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
// Using method-override
app.use(methodOverride('_method'));


// Import mongoose to the application
const mongoose = require('mongoose');
// Define connection with local mongoDB 
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
// Start connection with mongoDB
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('connected to mongoDB :) '));

// Index Router
app.use('/', indexRouter);
// Offices Router
app.use('/offices', officeRouter);
// Grades Router
app.use('/grades', gradeRouter);


app.listen(process.env.PORT || 3000, ()=> console.log('Server is running...'));