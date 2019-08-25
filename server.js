const mongoose = require("mongoose");
const express = require('express');
const exphbs = require('express-handlebars');
const htmlRoutes = require('./app/routes/htmlRoutes.js');
const apiRoutes = require('./app/routes/apiRoutes.js');

const PORT = process.env.PORT || 3030
const DB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrape-the-web";

const app = express();
app.use(express.json());
app.use(express.static('public'))
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

htmlRoutes.homeRoute(app);
apiRoutes.getArticlesRoute(app);
apiRoutes.getScrapeRoute(app);
app.listen(PORT);

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
}, function (error) {
  if (error) {
    console.log(error);
  }
  else {
    console.log("mongoose connection is successful");
  }
});