module.exports = {};

module.exports.homeRoute = (app) => {
  app.get('/', (req, res) => {
    res.render('home');
  });
};