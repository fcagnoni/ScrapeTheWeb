const axios = require("axios");
const cheerio = require("cheerio");

const Article = require("../models/Article");
const Comment = require("../models/Comment");


module.exports = {};

module.exports.getArticlesRoute = (app) => {

  // get all articles
  app.get('/api/articles', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Article.find()
      .populate('comments', ['text', 'createdAt'])
      .then(articles => {
        res.json(articles);
      })
      .catch(err => {
        res.json(err);
      });
  });

  // get a single an article
  app.get('/api/articles/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Article.findOne({
        _id: req.params.id
      })
      .then(article => {
        res.json(article);
      })
      .catch(err => {
        res.json(err);
      });
  });

  // delete an article
  app.delete('/api/articles/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Article.remove({
        _id: req.params.id
      })
      .then(article => {
        res.json(article);
      })
      .catch(err => {
        res.json(err);
      });
  });

  // create a comment
  app.post('/api/articles/:id/comments', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Article.findOne({
        _id: req.params.id
      })
      .then(article => {
        return Comment.create({
          text: req.body.text,
          article: article._id,
        })
        .then(newComment => {
          article.comments.push(newComment);
          return article.save()
        });
      })
      .then(article => {
        res.json({
          text: req.body.text,
          createdAt: new Date(),
        });
      })
      .catch(err => {
        res.json(err);
      });
  });

  // get comments
  app.get('/api/articles/:id/comments', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Comment.find({
        article: req.params.id
      })
      .then(comments => {
        res.json(comments);
      })
      .catch(err => {
        res.json(err);
      });
  });
};

module.exports.getScrapeRoute = (app) => {
  app.get('/api/scrape', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json([]);

    axios.get("https://www.rockpapershotgun.com/")
      .then(res => {
        scrapeRPS(res.data, articles => {
          console.log(`Scraping ${articles.length} articles...`);
          articles.forEach(article => {
            Article.create(article).catch(err => {});
          });
        });
      })
      .catch(res.json);
  });
};


const scrapeRPS = (data, cb) => {
  const $ = cheerio.load(data);

  const articles = [];
  $('main article').each((i, element) => {

    const title = $(element).find($('.title a')).text();
    const url = $(element).find($('.title a')).attr('href');
    const summary = $(element).find($('.excerpt')).text();

    const article = {
      title,
      url,
      summary
    };
    articles.push(article);
  });

  cb(articles);
}