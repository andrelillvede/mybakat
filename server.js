const express = require('express');
const next = require('next');
const fetch = require('node-fetch');
const contentful = require('contentful');
const parseUrl = require('url').parse;
const path = require('path');
const ImgixClient = require('imgix-core-js');
const hashObj = require('hash-obj');
const LRU = require('lru-cache');
const cache = LRU();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const ssrCache = new LRU({
  max: 100,
  maxAge: 1000 * 60 * 60, // 1hour
});

const client = contentful.createClient({
  space: 'u7wcr26n3tea',
  accessToken: '29877f03e59850cb986f083f575e7f9532ca1667ca4c5b855739210a74c8cdad',
});

var imgix = new ImgixClient({
  host: 'mybakat.imgix.net',
  secureURLToken: 'GP9Zva33MCvKqACp',
});

app.prepare().then(() => {
  const server = express();
  server.get('/', (req, res) => {
    renderAndCache(req, res, '/', {});
  });
  server.get('/en', (req, res) => {
    if (!req.url.endsWith('/')) {
      res.redirect(301, req.url + '/');
    } else {
      return renderAndCache(
        req,
        res,
        '/',
        Object.assign({ lang: 'en' }, req.query)
      );
    }
  });

  server.get('/en/blog/post/:slug', (req, res) => {
    return renderAndCache(
      req,
      res,
      '/post',
      Object.assign(req.params, { lang: 'en' }, req.query)
    );
  });

  server.get('/en/blog', (req, res) => {
    return renderAndCache(
      req,
      res,
      '/blog',
      Object.assign({ lang: 'en' }, req.query)
    );
  });

  server.get('/en/recipes/recipe/:slug', (req, res) => {
    return renderAndCache(
      req,
      res,
      '/recipe',
      Object.assign(req.params, { lang: 'en' }, req.query)
    );
  });

  server.get('/en/recipes', (req, res) => {
    return renderAndCache(
      req,
      res,
      '/recipes',
      Object.assign({ lang: 'en' }, req.query)
    );
  });

  server.get('/recipes/recipe/:slug', (req, res) => {
    return renderAndCache(
      req,
      res,
      '/recipe',
      Object.assign(req.params, req.query)
    );
  });

  server.get('/blog/post/:slug', (req, res) => {
    return renderAndCache(
      req,
      res,
      '/post',
      Object.assign(req.params, req.query)
    );
  });

  server.get('/sw.js', (req, res) =>
    res.sendFile(path.resolve('./.next/sw.js'))
  );

  server.get('/imageCache', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const obj = {};
    cache.forEach((val, key) => {
      obj[key] = val;
    });
    res.send({ cache: obj });
  });

  server.get('/image/:size/:url', (req, res) => {
    ssrCache.reset();
    let { url, size } = req.params;
    url = decodeURI(url);
    const common = {};
    const large = {
      h: 1200,
      w: 1200,
      auto: 'compress,format',
    };

    const medium = {
      h: 800,
      w: 800,
      auto: 'compress,format',
    };

    const small = {
      h: 400,
      w: 400,
      auto: 'compress,format',
    };

    const smallest = {
      h: 200,
      w: 200,
      auto: 'compress,format',
    };

    const srcSet = {
      large: imgix.buildURL(url, large),
      medium: imgix.buildURL(url, medium),
      small: imgix.buildURL(url, small),
      smallest: imgix.buildURL(url, smallest),
    };

    cache.set(url, srcSet);

    fetch(srcSet[size]).then(img => img.body.pipe(res));
  });

  server.get('/instagram', (req, res) => {
    const url = 'https://www.instagram.com/mybakat/?__a=1';
    res.setHeader('Content-Type', 'application/json');

    if (cache.has(url)) {
      res.send(cache.get(url));
      return;
    }

    fetch(url)
      .then(result => result.json())
      .then(json => {
        const posts = json.user.media.nodes.slice(0, 9);
        cache.set(url, posts);
        res.send(posts);
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

function getCacheKey(req) {
  return `${req.url}`;
}

function renderAndCache(req, res, pagePath, queryParams) {
  const key = getCacheKey(req);

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    console.log(`CACHE HIT: ${key}`);
    res.send(ssrCache.get(key));
    return;
  }

  // If not let's render the page into HTML
  app
    .renderToHTML(req, res, pagePath, queryParams)
    .then(html => {
      // Let's cache this page
      console.log(`CACHE MISS: ${key}`);
      ssrCache.set(key, html);

      res.send(html);
    })
    .catch(err => {
      app.renderError(err, req, res, pagePath, queryParams);
    });
}
