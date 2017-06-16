import React from 'react';
import 'isomorphic-fetch';
import objectFitVideos from 'object-fit-videos';
import Head from 'next/head';
import marked from 'marked';
import classNames from 'classnames';

import '../helpers/offline-install';
import { t, l } from '../helpers/translation';
import image from '../helpers/image';

import Nav from '../components/index/Nav';
import Instagram from '../components/index/Instagram';
import BlogPosts from '../components/index/BlogPosts';

export default class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      instagramPosts: [],
      blogPosts: [],
      logoHidden: true,
    };
    this.getSection = this.getSection.bind(this);
  }
  componentWillMount() {
    this.lang = this.props.url.query.lang;
  }
  componentDidMount() {
    objectFitVideos();

    this.video.addEventListener('loadedmetadata', getmetadata);
    const getmetadata = () => {
      this.video.play();
    };

    if (this.video.readyState >= 2) {
      getmetadata();
    }

    const loaded = () => {
      this.setState({
        logoHidden: false,
      });
    };

    if (this.logo.complete) {
      loaded();
    } else {
      this.logo.addEventListener('load', loaded);
      this.logo.addEventListener('error', function() {
        console.error('could not load logo');
      });
    }
  }

  static async getInitialProps({ req }) {
    // get frontpage
    let hostname = req ? req.headers.host : window.location.host;
    let protocol = hostname === 'localhost:5000' ? 'http:' : 'https:';
    const response = await fetch(`${protocol}//${hostname}/imageCache`);
    const json = await response.json();

    const query = JSON.stringify({
      'sys.id': '3ZCxovbELKgoOUEeIOsu8q',
    });

    const frontpageContentful = await fetch(
      `${protocol}//${hostname}/contentful/get_entries/${query}`
    );
    const frontpage = await frontpageContentful.json();

    return {
      location: `${protocol}//${hostname}`,
      frontpage: frontpage.items[0].fields,
      cache: json.cache,
    };
  }
  getSection(name) {
    return this[name];
  }
  render() {
    let logoClasses = classNames({
      logo: true,
      hidden: this.state.logoHidden,
    });
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
        <Head>
          <title>Mybakat</title>
          <meta property="og:url" content="https://mybakat.se" />
          <meta property="og:title" content="Mybakat" />
          <meta property="og:description" content="Mybakat" />
          <meta
            property="og:image"
            content="https://mybakat.se/static/logo_brown.svg"
          />
        </Head>
        <div className="top">
          <video
            autoPlay
            muted
            playsInline
            src="/static/dreams.mp4"
            ref={e => {
              this.video = e;
            }}
          />
          <img
            width="30%"
            src={frontpage.intro_logo.fields.file.url}
            alt="logo"
            className={logoClasses}
            ref={e => {
              this.logo = e;
            }}
          />

          <div className="language">
            <a href="/">Sv</a> | <a href="/en">En</a>
          </div>
        </div>
        <div className="main">
          <Nav lang={this.lang} getSection={this.getSection} />
          <div id="about" className="section">

            <div
              className="about"
              dangerouslySetInnerHTML={{
                __html: `<img src=${image(this.props.cache, this.props.location + '/static/hel.jpg', 'large')}
                sizes="25vw"
                srcset="
                  ${image(this.props.cache, this.props.location + '/static/hel.jpg', 'smallest')} 200w,
                  ${image(this.props.cache, this.props.location + '/static/hel.jpg', 'small')} 400w,
                  ${image(this.props.cache, this.props.location + '/static/hel.jpg', 'medium')} 800w,
                  ${image(this.props.cache, this.props.location + '/static/hel.jpg', 'large')} 1200w"
                alt="picture of author"
               />${marked(l(this.lang, frontpage, 'about'))}`,
              }}
            />
            <div style={{ clear: 'both' }} />
          </div>
          <div className="section">
            <h2>Instagram</h2>
            <Instagram {...this.props} />
          </div>
          <div className="section">
            <h2>{t(this.lang, 'Senaste inläggen', 'Latest posts')}</h2>
            <BlogPosts lang={this.lang} {...this.props} />
          </div>
          <footer />
        </div>
        <style jsx>{`
          :global(p:first-of-type) {
            margin-top: 0;
          }
          #about {
            /*display: flex;
            flex-flow: row;
            align-items: flex-start;*/
            & .about {
              width: 100%;
              float:left;
              & :global(img) {
                float:right;
                width: 40%;
                padding: 0 0 1em 1em;
              }
            }
          }
          h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.3em;
            margin: 2em 0 0 0;
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
            font-family: 'object-fit: cover;';
            z-index: -1;
          }
          .logo {
            transition: opacity 1.5s;
          }
          .hidden {
            opacity: 0;
          }
          footer {
            height: 4em;
            background-color: rgb(74, 48, 20);
          }
          `}</style>
      </div>
    );
  }
}
