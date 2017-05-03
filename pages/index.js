import React from 'react';
import * as contentful from 'contentful';
import 'isomorphic-fetch';

import '../helpers/offline-install';
import { t, l } from '../helpers/translation';
import image from '../helpers/image';

import Nav from '../components/index/Nav';
import Instagram from '../components/index/Instagram';
import BlogPosts from '../components/index/BlogPosts';

const client = contentful.createClient({
  space: 'u7wcr26n3tea',
  accessToken: '29877f03e59850cb986f083f575e7f9532ca1667ca4c5b855739210a74c8cdad',
});

export default class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      instagramPosts: [],
      blogPosts: [],
    };
  }
  componentWillMount() {
    this.lang = this.props.url.query.lang;
  }
  static async getInitialProps({ req }) {
    // get frontpage
    let hostname = req ? req.headers.host : window.location.host;
    let protocol = hostname === 'localhost:3000' ? 'http:' : 'https:';
    const response = await fetch(`${protocol}//${hostname}/imageCache`);
    const json = await response.json();

    const frontpage = await client.getEntries({
      'sys.id': '3ZCxovbELKgoOUEeIOsu8q',
    });

    return {
      frontpage: frontpage.items[0].fields,
      cache: json.cache,
    };
  }

  render() {
    const { frontpage, cache } = this.props;
    return (
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
        }}
      >
        <div className="top">
          <video autoPlay src={frontpage.intro_media.fields.file.url} />
          <img width="30%" src={frontpage.intro_logo.fields.file.url} />
        </div>
        <div className="main">
          <Nav lang={this.lang} />
          <div className="section">
            <h2>{t(this.lang, 'Om', 'About')}</h2>
            {l(frontpage, 'about')}
          </div>
          <div className="section">
            <h2>Instagram</h2>
            <Instagram {...this.props} />
          </div>
          <div className="section">
            <h2>{t(this.lang, 'Senaste inläggen', 'Latest posts')}</h2>
            <BlogPosts lang={this.lang} {...this.props} />
          </div>
        </div>
        <style jsx>{`
          h2 {
            font-size: 2em;
            margin: 0;
          }
          .top {
            background-color: black;
            position:fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 0;
            left:0;
            font-size: 3em;
            /*background: url(/static/cat.jpg);*/
            background-position: center;
            background-size: cover;
            height: 100vh;
            width: 100vw;
          }
          .main {
            position: relative;
            background-color: white;
            top: 90vh;
            min-height: 100vh;
            width: 100vw;
          }
          .section {

            width: 100vw;
            background-color: white;
            padding: 0 2em;
          }
          video {
            position:absolute;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
            object-fit: cover;
            z-index: -1;
          }
          `}</style>
      </div>
    );
  }
}
