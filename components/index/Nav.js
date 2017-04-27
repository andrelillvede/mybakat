import classNames from 'classnames';
import Link from 'next/link';
import { t, l } from '../../helpers/translation';

class Nav extends React.Component {
  state = {
    sticky: false,
  };
  componentWillMount() {
    this.lang = this.props.lang;
  }
  componentDidMount() {
    let latestKnownScrollY = 0, ticking = false;

    const onScroll = () => {
      latestKnownScrollY = window.scrollY;
      requestTick();
    };

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
        <Link href="blog" prefetch><a>{t(this.lang, 'Blogg', 'Blog')}</a></Link>
        <Link href="recipes" prefetch>
          <a>{t(this.lang, 'Recept', 'Recipes')}</a>
        </Link>
        <Link href="#"><a>{t(this.lang, 'Om mig', 'About me')}</a></Link>
        <Link href="#"><a>{t(this.lang, 'Kontakt', 'Contact')}</a></Link>
        <style jsx>{`
          a {
            color: #474747;
            text-decoration: none;
            &:hover {
              color: yellow;
            }
          }
          .nav {
            position: sticky;
            display: flex;
            z-index: 9999;
            align-items: center;
            justify-content:space-between;
            /*will-change: scroll-position;*/
            top: -1px;
            background-color: #E8E8E8;
            height: 10vh;
            padding: 0 20vw;
            margin-bottom: 3em;
            font-family: 'Raleway', sans-serif;
          }
          `}</style>
      </div>
    );
  }
}

export default Nav;
