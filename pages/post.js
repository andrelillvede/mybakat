import React from 'react';
import * as contentful from 'contentful';
import moment from 'moment';
import marked from 'marked';
import Link from 'next/link';
import '../helpers/offline-install';
import image from '../helpers/image';
import 'isomorphic-fetch';

import { t, l } from '../helpers/translation';

const client = contentful.createClient({
  space: 'u7wcr26n3tea',
  accessToken: '29877f03e59850cb986f083f575e7f9532ca1667ca4c5b855739210a74c8cdad',
});

class Post extends React.Component {
  componentWillMount() {
    this.lang = this.props.url.query.lang;
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

  render() {
    const { post } = this.props;
    return (
      <div className="post">
        <div className="top">
          <img src="/static/logo_brown.svg" />
          <div className="menu">
            <div>
              <Link href="/" prefetch>
                <a>{t(this.lang, 'Hem', 'Home')}</a>
              </Link>
            </div>
            <div>Sök</div>
            <div>Arkiv</div>
          </div>
        </div>
        {!post
          ? 'could not load blog post :('
          : <div>
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

              recipe: {JSON.stringify(post.fields.recipe)}

            </div>}
        <style jsx>{`
          a {
            text-decoration: underline;
            color: black;
            justify-content: space-between;
          }

          .top {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 3em;
          }

          .top img {
            margin-top: 1em;
            margin-left: 1em;
            width: 7em;
          }

          .menu {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-family: 'Playfair Display', serif;
            letter-spacing: 0.05em;
            margin-top: 1em;
            margin-right: 1em;
            & > div:not(:last-child) {
              margin-right: 1em;
            }
          }
          .blog {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .post {
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            justify-content: space-between;
            text-align: center;
            margin-bottom: 4em;

            & .text {
              padding: 0 5em;
              text-align: left;
            }
          }
          .title, .date {
            font-family: 'Playfair Display', serif;
            font-weight: normal;
            font-weight: normal;
            letter-spacing: 0.2em;
          }

          .title {
            font-size: 2em;
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

export default Post;
