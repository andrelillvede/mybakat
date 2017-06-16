import Link from 'next/link';
import Router from 'next/router';
import Head from 'next/head';

import classNames from 'classnames';
import NProgress from 'nprogress';
import scrollTo from 'scroll-to-element';

import { t, l, link } from '../../helpers/translation';
import { initGA, logPageView } from '../../helpers/ga';

class Nav extends React.Component {
  state = {
    sticky: false,
  };
  componentWillMount() {
    Router.onRouteChangeStart = url => {
      console.log(`Loading: ${url}`);
      NProgress.start();
    };
    Router.onRouteChangeComplete = () => NProgress.done();
    Router.onRouteChangeError = () => NProgress.done();
    this.lang = this.props.lang;
  }
  componentDidMount() {
    initGA();
    logPageView();
    let latestKnownScrollY = 0, ticking = false;

    const onScroll = (this.onScroll = () => {
      latestKnownScrollY = window.scrollY;
      requestTick();
    });

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(update);
      }
      ticking = true;
    };

    const update = () => {
      // reset the tick so we can
      // capture the next onScroll
      ticking = false;

      const currentScrollY = latestKnownScrollY;
      const viewportOffset = this.navEl.getBoundingClientRect();

      if (viewportOffset.top <= 0) {
        this.setState({
          sticky: true,
        });
      } else {
        this.setState({
          sticky: false,
        });
      }
    };
    window.addEventListener('scroll', onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }
  render() {
    let navClasses = classNames({
      nav: true,
      fixed: this.state.sticky,
    });
    return (
      <div
        ref={navEl => {
          this.navEl = navEl;
        }}
        style={this.props.style}
        className={navClasses}
      >
        <Head>
          {/* Import CSS for nprogress */}

        </Head>
        <img className="small-logo" src="/static/logo_white.svg" alt="logo" />
        <div className="links">
          <Link
            href={{ pathname: `/blog`, query: { lang: this.lang } }}
            as={link(this.lang, `/blog`)}
            prefetch
          >
            <a className="link">{t(this.lang, 'Blogg', 'Blog')}</a>
          </Link>
          {/* <Link href="recipes" prefetch>
            <a>{t(this.lang, 'Recept', 'Recipes')}</a>
          </Link> */}

          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              scrollTo('#about', {
                align: 'middle',
                ease: 'in-cube',
                duration: 600,
              });
            }}
          >
            {t(this.lang, 'Om Mybakat', 'About Mybakat')}
          </a>

          {/* <a
            href="#"
            onClick={e => {
              e.preventDefault();
              scrollTo('#contact', {
                align: 'middle',
                ease: 'in-cube',
                duration: 600,
              });
            }}
          >
            {t(this.lang, 'Kontakt', 'Contact')}
          </a> */}
        </div>
        <style jsx>{`
          a {
            color: white;
            text-decoration: none;
            &:hover {
              color: #4287ab;
            }
          }
          .nav {
            transition: height 0.2s, line-height 0.2s, padding 0.2s, box-shadow 0.5s;
            position: sticky;
            /*display: flex;*/
            z-index: 9999;
            /*align-items: center;*/
            /*justify-content:space-between;*/
            /*will-change: scroll-position;*/
            top: -1px;
            background-color: rgb(74, 48, 20);
            height: 5vw;
            width: 100vw;
            padding: 0 35vw;
            line-height: 5vw;
            margin-bottom: 3em;

            & .small-logo {
              transition: opacity 0.8s;
              position: absolute;
              left: 1em;
              top: 1.5vh;
              line-height: 10vh;
              opacity: 0;
              height: 0px;
            }

            & .links {
              transition: width 0.2s, font-size 0.2s ;
              display: flex;
              justify-content: space-between;
              width: 30vw;
              font-size: 1.2em;
            }
          }

          .nav.fixed {
            height: 6vh;
            line-height: 6vh;
            padding: 0 0 0 70vw;
            box-shadow: 0px 1px 4px #6e6e6e;
            & .small-logo {
              opacity: 1;
              height: 3vh;
            }
            & .links {
              display: flex;
              justify-content: flex-end;
              width: calc(30vw - 1em);
              margin-right: 1em;
              font-size: 1em;
              & .link:not(:last-child) {
                margin-right: 1em;
              }
            }
          }

          @media screen and (max-width: 700px) {
            .nav {
              padding: 0 30vw;
              & .links {
                width: 40vw;
                margin-right: 1em;
                font-size: 1em;
              }
            }
          }
          `}</style>
      </div>
    );
  }
}

export default Nav;
