import React from 'react';
import * as contentful from 'contentful';
import moment from 'moment';
import Link from 'next/link';

import { t, l } from '../../helpers/translation.js';
import image from '../../helpers/image';

const client = contentful.createClient({
  space: 'u7wcr26n3tea',
  accessToken: '29877f03e59850cb986f083f575e7f9532ca1667ca4c5b855739210a74c8cdad',
});

class BlogPosts extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    };
  }

  componentWillMount() {
    this.lang = this.props.lang;
  }

  componentDidMount() {
    client.getEntries({ content_type: 'blogPost', limit: 6 }).then(posts => {
      this.setState({ posts: posts.items });
    });
  }
  render() {
    return (
      <div className="blog">
        {!this.state.posts
          ? 'could not load blog posts :('
          : this.state.posts.map(post => {
              return (
                <div key={post.sys.id} className="post">
                  <a href={`blog/posts/${post.fields.slug}`}>
                    <img
                      src={image(
                        this.props.cache,
                        'https:' + post.fields.post_image.fields.file.url,
                        'small'
                      )}
                    />
                    <div className="info">
                      {l(this.lang, post.fields, 'title')}<br />
                      {moment(post.sys.createdAt).format('YYYY/MM/DD')}
                    </div>
                  </a>
                </div>
              );
            })}
        <style jsx>{`
          a {
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            text-decoration: none;
            color: black;
            justify-content: space-between;
          }
          .blog {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-around;
          }

          .title {
            padding: 0 1em;
            margin-top: 2em;
          }

          .info {
            padding: 1em;
          }
          .post {
            width: 25%;
            height: 30vw;
            margin: 2em 0;
            border: 2px solid #E8E8E8;
            &:hover {
              position:relative;
              top: -10px;
              left: -10px;
              box-shadow: 10px 10px 0px 0px #603913;
            }
          }
          img {
            object-fit: cover;
            width: 100%;
            height: 70%;
          }

          @media screen and (max-width: 768px) {
              .post {
                width: 48%;
                height: 60vw;
              }
          }
          `}</style>
      </div>
    );
  }
}

export default BlogPosts;
