import React from 'react';
import * as contentful from 'contentful';
import moment from 'moment';
import Link from 'next/link';
import objectFitImages from 'object-fit-images';

import { t, l, link } from '../../helpers/translation.js';
import image from '../../helpers/image';

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
    let hostname = window.location.host;
    let protocol = hostname === 'localhost:5000' ? 'http:' : 'https:';

    const query = JSON.stringify({ content_type: 'blogPost', limit: 6 });

    fetch(`${protocol}//${hostname}/contentful/get_entries/${query}`)
      .then(response => response.json())
      .then(posts => {
        console.log(posts);
        this.setState({ posts: posts.items });
      });

    objectFitImages();
  }
  render() {
    return (
      <div className="blog">
        {!this.state.posts
          ? 'could not load blog posts :('
          : this.state.posts.map(post => {
              return (
                <div key={post.sys.id} className="post">
                  <Link
                    href={{ pathname: `/post`, query: { lang: this.lang } }}
                    as={link(this.lang, `/blog/post/${post.fields.slug}`)}
                  >
                    <a>
                      <div className="image">
                        <img
                          src={image(
                            this.props.cache,
                            'https:' + post.fields.post_image.fields.file.url,
                            'small'
                          )}
                          alt="post image"
                        />
                      </div>
                      <div className="info">
                        {l(this.lang, post.fields, 'title')}<br />
                        {moment(post.sys.createdAt).format('YYYY/MM/DD')}
                      </div>
                    </a>
                  </Link>
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

          .post {
            width: 25%;
            height: 30vw;
            margin: 2em 0;
            border: 2px solid #E8E8E8;
            & .image {
              height: 70%;
            }
            & .info {
              padding: 11% 6%;
              height: 30%;
            }
            &:hover {
              position:relative;
              top: -5px;
              left: -5px;
              box-shadow: 5px 5px 0px 0px #CFCFCF;
            }
          }
          img {
            object-fit: cover;
            font-family: 'object-fit: cover;';
            width: 100%;
            height: 100%;
          }

          @media screen and (max-width: 768px) {
              .post {
                width: 48%;
                height: 60vw;
                font-size: 1.2em;
              }
          }
          `}</style>
      </div>
    );
  }
}

export default BlogPosts;
