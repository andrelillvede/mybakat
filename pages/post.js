import React from 'react';
import * as contentful from 'contentful';
import moment from 'moment';
import marked from 'marked';
import Link from 'next/link';

import NProgress from 'nprogress';
import Router from 'next/router';
import Head from 'next/head';

import '../helpers/offline-install';
import image from '../helpers/image';
import { initGA, logPageView } from '../helpers/ga';
import 'isomorphic-fetch';

import { t, l } from '../helpers/translation';

import Cover from '../components/post/Cover';

const client = contentful.createClient({
  space: 'u7wcr26n3tea',
  accessToken: '29877f03e59850cb986f083f575e7f9532ca1667ca4c5b855739210a74c8cdad',
});

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.contentFixed = this.contentFixed.bind(this);
  }
  componentWillMount() {
    Router.onRouteChangeStart = url => {
      console.log(`Loading: ${url}`);
      NProgress.start();
    };
    Router.onRouteChangeComplete = () => NProgress.done();
    Router.onRouteChangeError = () => NProgress.done();
    this.lang = this.props.url.query.lang;
    console.log(this.props);
  }
  componentDidMount() {
    initGA();
    logPageView();
  }

  static async getInitialProps({ req, asPath }) {
    let hostname = req ? req.headers.host : window.location.host;
    let protocol = hostname === 'localhost:3000' ? 'http:' : 'https:';
    const response = await fetch(`${protocol}//${hostname}/imageCache`);
    const json = await response.json();

    const parts = asPath.split('/');
    const slug = parts.pop() || parts.pop();
    const posts = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1,
    });
    return { post: posts.items[0], cache: json.cache };
  }

  contentFixed(fixed) {
    if (fixed) {
      this.postRef.style.position = 'fixed';
      this.postRef.style.top = '0px';
    } else {
      this.postRef.style.position = 'relative';
      this.postRef.style.top = '100vh';
    }
  }

  render() {
    const { post } = this.props;
    const { postRef } = this.props;

    return (
      <div className="post">
        <Head>
          {/* Import CSS for nprogress */}
          <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
        </Head>
        <Cover
          lang={this.lang}
          contentFixed={this.contentFixed}
          coverImg={post.fields.post_image.fields.file.url}
        >
          <div className="language">
            <a href={`/blog/post/${post.fields.slug}`}>Sv</a>
            {' '}
            |
            {' '}
            <a href={`/en/blog/post/${post.fields.slug}`}>En</a>
          </div>
          <div className="title">{l(this.lang, post.fields, 'title')}</div>
          <div className="date">
            {moment(post.sys.createdAt).format('YYYY/MM/DD')}
          </div>
        </Cover>
        {!post
          ? 'could not load blog post :('
          : <div
              className="content"
              ref={postRef => {
                this.postRef = postRef;
              }}
            >
              <div className="title">{l(this.lang, post.fields, 'title')}</div>
              <div className="date">
                {moment(post.sys.createdAt).format('YYYY/MM/DD')}
              </div>
              {/* updated: {moment(post.sys.updatedAt).format('YYYY/MM/DD')}<br /> */}
              {/* <img
                src={image(
                  this.props.cache,
                  'https:' + post.fields.post_image.fields.file.url,
                  'small'
                )}
              /> */}
              <div
                className="text"
                dangerouslySetInnerHTML={{
                  __html: marked(l(this.lang, post.fields, 'text')),
                }}
              />

              {post.fields.recipe
                ? post.fields.recipe.map(recipe => {
                    return (
                      <div key={recipe.fields.title} className="recipe">
                        <h2>{l(this.lang, recipe.fields, 'title')}</h2>
                        <div className="fields">
                          <div className="ingredients">
                            <h3>
                              {t(this.lang, 'Ingredienser', 'Ingredients')}
                            </h3>
                            <div
                              className="text"
                              dangerouslySetInnerHTML={{
                                __html: marked(
                                  l(this.lang, recipe.fields, 'ingredients')
                                ),
                              }}
                            />
                          </div>
                          <div className="instructions">
                            <h3>
                              {t(this.lang, 'Instruktioner', 'Instructions')}
                            </h3>
                            <div
                              className="text"
                              dangerouslySetInnerHTML={{
                                __html: marked(
                                  l(this.lang, recipe.fields, 'instructions')
                                ),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ''}

            </div>}
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
            color: white;
            & a {
              color: white;
              text-decoration: none;
            }
          }
          .post {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            justify-content: space-between;

            & .text {
              margin-top: 1.5em;

            }
          }

          .content {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1;
            padding: 4em;
            & :global(h2), & :global(h3) {
              font-family: 'Playfair Display', serif;
              font-weight: normal;
              margin-bottom: 0;
            }

            & :global(ul) {
              margin: 0;
              padding: 0 0 0 0.2rem;
              list-style: none;
            }

            & .recipe {
              border: 1px black dotted;
              padding: 2em;
              margin-top: 3em;
              & h2 {
                margin-top: 0;
              }
              & .text {
                margin: 0.7rem 0;
              }
              & .fields {
                display: flex;
                flex-flow: row;
                justify-content: space-between;

                & .ingredients {
                  margin-right: 3em;
                }
              }
              @media screen and (max-width: 600px) {
                & .fields {
                  flex-flow: column;
                }
              }
            }
          }
          .title, .date {
            font-family: 'Playfair Display', serif;
            font-style: italic;
            font-weight: normal;
          }

          .title {
            font-size: 1.8em;
            margin-bottom: 0;
          }

          .date {
            font-size: 1em;
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

export default Post;
