import React from 'react';
import * as contentful from 'contentful';
import moment from 'moment';
import marked from 'marked';
import '../helpers/offline-install';

import { t, l } from '../helpers/translation';

const client = contentful.createClient({
  space: 'u7wcr26n3tea',
  accessToken: '29877f03e59850cb986f083f575e7f9532ca1667ca4c5b855739210a74c8cdad',
});

class Blog extends React.Component {
  componentWillMount() {
    this.lang = this.props.url.query.lang;
  }

  static async getInitialProps() {
    const posts = await client.getEntries({
      content_type: 'blogPost',
      limit: 10,
    });
    console.log(posts.items);
    return { posts: posts.items };
  }

  render() {
    return (
      <div className="blog">
        <div className="top">
          <img width="50%" src="static/logo_brown.svg" />
        </div>
        <div className="menu">
          <div>Hem</div>
          <div>Sök</div>
          <div>Arkiv</div>
        </div>
        {!this.props.posts
          ? 'could not load blog posts :('
          : this.props.posts.map(post => {
              return (
                <div className="posts">
                  <div key={post.sys.id} className="post">
                    <h2 className="title">
                      {l(this.lang, post.fields, 'title')}
                    </h2>
                    <div className="date">
                      {moment(post.sys.createdAt).format('YYYY / MM / DD')}
                    </div>

                    <img
                      height="100%"
                      src={post.fields.post_image.fields.file.url}
                    />
                    <div className="description">
                      {l(this.lang, post.fields, 'description')}
                    </div>
                    <a
                      className="read-more"
                      href={`blog/posts/${post.fields.slug}`}
                    >
                      {t(this.lang, 'Läs mer', 'Read more')}
                    </a>

                  </div>
                </div>
              );
            })}
        <style jsx>{`
          a {
            text-decoration: underline;
            color: black;
            justify-content: space-between;
          }
          .posts img {
            margin-top: 2em;
            object-fit: contain;
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
            width: 30%;
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
            height: 100%;
            width: 100%;
            justify-content: space-between;
            text-align: center;
            margin-bottom: 4em;
          }
          .title, .date {
            font-family: 'Playfair Display', serif;
            font-weight: normal;
            font-weight: normal;
            letter-spacing: 0.2em;
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
