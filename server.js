const express = require('express');
const next = require('next');
const fetch = require('node-fetch');
const contentful = require('contentful');
const parseUrl = require('url').parse;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const client = contentful.createClient({
  space: 'u7wcr26n3tea',
  accessToken: '29877f03e59850cb986f083f575e7f9532ca1667ca4c5b855739210a74c8cdad',
});

app.prepare().then(() => {
  const server = express();

  server.get('/en', (req, res) => {
    if (!req.url.endsWith('/')) {
      res.redirect(301, req.url + '/');
    } else {
      return app.render(
        req,
        res,
        '/',
        Object.assign({ lang: 'en' }, req.query)
      );
    }
  });

  server.get('/en/blog/post/:slug', (req, res) => {
    return app.render(
      req,
      res,
      '/post',
      Object.assign(req.params, { lang: 'en' }, req.query)
    );
  });

  server.get('/en/blog', (req, res) => {
    return app.render(
      req,
      res,
      '/blog',
      Object.assign({ lang: 'en' }, req.query)
    );
  });

  server.get('/en/recipes/recipe/:slug', (req, res) => {
    return app.render(
      req,
      res,
      '/recipe',
      Object.assign(req.params, { lang: 'en' }, req.query)
    );
  });

  server.get('/en/recipes', (req, res) => {
    return app.render(
      req,
      res,
      '/recipes',
      Object.assign({ lang: 'en' }, req.query)
    );
  });

  server.get('/recipes/recipe/:slug', (req, res) => {
    return app.render(
      req,
      res,
      '/recipe',
      Object.assign(req.params, req.query)
    );
  });

  server.get('/blog/post/:slug', (req, res) => {
    return app.render(req, res, '/post', Object.assign(req.params, req.query));
  });

  server.get('/instagram', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    fetch('https://www.instagram.com/mybakat/?__a=1')
      .then(result => result.json())
      .then(json => {
        res.send(json.user.media.nodes.slice(0, 9));
      })
      .catch(err => console.error(err));
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
