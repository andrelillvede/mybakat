import classNames from 'classnames';
import Link from 'next/link';
import { t, l, link } from '../../helpers/translation';
import objectFitImages from 'object-fit-images';

class Cover extends React.Component {
  componentWillMount() {
    this.lang = this.props.lang;
  }
  componentDidMount() {
    objectFitImages();
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
      const viewportOffset = this.coverEl.getBoundingClientRect();

      if (viewportOffset.bottom <= 0) {
        this.coverEl.style.height = '100vh';
        this.props.contentFixed(false);
      } else {
        this.props.contentFixed(true);
      }
    };
    window.addEventListener('scroll', onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }
  render() {
    return (
      <div style={this.props.style} className="cover">
        <div id="silkscreen" />
        <img
          src={this.props.coverImg}
          ref={coverEl => {
            this.coverEl = coverEl;
          }}
        />

        <div className="top">
          <img className="logo" src="/static/logo_white.svg" />
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
          <div className="children">
            {this.props.children}
          </div>
        </div>

        <style jsx>{`
          .top {
            position: absolute;
            top: 0;
            z-index: 10;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4em;
          }

          .logo {
            margin: 4em 0 0 0;
            width: 10em;
          }

          .menu {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            font-size: 0.8em;
            color: white;
            margin: 1em 0 0 0;
            & a {
              color: white;
            }
            & > div:not(:last-child) {
              margin-right: 1em;
            }
          }

          .cover {
            position: absolute;
            display: flex;
            flex-direction: column;
            top: 0;
            left: 0;
            width: 100vw;
            height: 200vh;
            z-index: 2;

            & .children {
              margin-top: 23vh;
              text-align: center;
              font-size: 1.5em;
              color: white;
              letter-spacing: 0.05em;
            }
            & #silkscreen {
              position: absolute;
              top:0;
              left:0;
              /*background: url(/static/silkscreen.svg);
              background-size:1px 1px, 100%;
	            background-repeat: repeat, no-repeat;*/
              background-color: rgba(74, 48, 20, 0.7);
              height: 50%;
              width: 100%;
            }
            & >img {
              height: 50%;
              width: 100%;
              background-color: white;
              object-fit: cover;
              font-family: 'object-fit: cover;'
            }
          }
          `}</style>
      </div>
    );
  }
}

export default Cover;
