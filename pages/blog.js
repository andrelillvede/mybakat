import React from 'react';
import * as contentful from 'contentful';
import moment from 'moment';
import marked from 'marked';
import Link from 'next/link';
import objectFitImages from 'object-fit-images';

import NProgress from 'nprogress';
import Router from 'next/router';
import Head from 'next/head';

import '../helpers/offline-install';
import { initGA, logPageView } from '../helpers/ga';

import { t, l, link } from '../helpers/translation';

const client = contentful.createClient({
  space: 'u7wcr26n3tea',
  accessToken: '29877f03e59850cb986f083f575e7f9532ca1667ca4c5b855739210a74c8cdad',
});

class Blog extends React.Component {
  componentDidMount() {
    initGA();
    logPageView();
    objectFitImages();
  }
  componentWillMount() {
    Router.onRouteChangeStart = url => {
      console.log(`Loading: ${url}`);
      NProgress.start();
    };
    Router.onRouteChangeComplete = () => NProgress.done();
    Router.onRouteChangeError = () => NProgress.done();
    this.lang = this.props.url.query.lang;
  }

  static async getInitialProps() {
    const posts = await client.getEntries({
      content_type: 'blogPost',
      limit: 10,
    });
    return { posts: posts.items };
  }

  render() {
    return (
      <div className="blog">
        <Head>
          {/* Import CSS for nprogress */}
          <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
        </Head>
        <div className="language">
          <a href="/blog">Sv</a> | <a href="/en/blog">En</a>
        </div>
        <div className="top">
          <img width="50%" src="/static/logo_brown.svg" />
        </div>
        <div className="menu">
          <div>
            <Link
              href={{ pathname: `/`, query: { lang: this.lang } }}
              as={link(this.lang, ``)}
              prefetch
            >
              <a>{t(this.lang, 'Hem', 'Home')}</a>
            </Link>
          </div>
          {/* <div>Sök</div>
          <div>Arkiv</div> */}
        </div>
        <div className="posts">
          {!this.props.posts
            ? 'could not load blog posts :('
            : this.props.posts.map(post => {
                return (
                  <div key={post.sys.id} className="post">
                    <h2 className="title">
                      <Link
                        href={{ pathname: `/post`, query: { lang: this.lang } }}
                        as={link(this.lang, `/blog/post/${post.fields.slug}`)}
                        prefetch
                      >
                        <a>{l(this.lang, post.fields, 'title')}</a>
                      </Link>
                    </h2>
                    <div className="date">
                      {moment(post.sys.createdAt).format('YYYY / MM / DD')}
                    </div>

                    <img src={post.fields.post_image.fields.file.url} />
                    <div className="description">
                      {l(this.lang, post.fields, 'description')}
                    </div>

                    <Link
                      href={{ pathname: `/post`, query: { lang: this.lang } }}
                      as={link(this.lang, `/blog/post/${post.fields.slug}`)}
                      prefetch
                    >
                      <a className="read-more">
                        {t(this.lang, 'Läs mer', 'Read more')}
                      </a>
                    </Link>
                  </div>
                );
              })}
        </div>
        <style jsx>{`
          a {
            text-decoration: underline;
            color: black;
            justify-content: space-between;
          }
          .language {
            position: absolute;
            top: 1em;
            right: 1em;
            font-size: 1rem;
            color: black;
            & a {
              color: black;
              text-decoration: none;
            }
          }
          .post img {
            margin-top: 2em;
            object-fit: contain;
            font-family: 'object-fit: contain;'; /*object-fit polyfill*/
            width:80vw; /* you can use % */
            height: auto;
            max-height: 60vh;
            /*width: 100%;*/
          }
          .top {
            width: 100%;
            text-align: center;
          }

          .top img {
            margin-top: 2em;
            width: 30%;
          }

          .menu {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            /*width: 30%;*/
            font-family: 'Playfair Display', serif;
            letter-spacing: 0.05em;

            margin-top: 1em;
          }
          .blog {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .posts {
            margin-top: 4em;
            display: flex;
            flex-direction: column;
            width: 80%;
          }
          .post {
            position: relative;
            display: flex;
            flex-direction: column;

            width: 100%;
            justify-content: space-between;
            text-align: center;
            margin-bottom: 4em;
          }

          .post :global(a) {
            text-decoration: none;
            color: black;
          }
          .title, .date {
            font-family: 'Playfair Display', serif;
            font-weight: normal;
            font-weight: normal;
            letter-spacing: 0.04em;
          }

          .title {
            margin-bottom: 0;
          }

          .date {
            font-size: 0.8em;
          }
          .description {
            margin-top: 1em;
            text-align: left;
          }
          .read-more {
            margin-top: 1em;
          }
          `}</style>
      </div>
    );
  }
}

export default Blog;
