import classNames from 'classnames';

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
    const t = (sv, en) => {
      if (this.lang === 'en') return en;
      return sv;
    };

    const l = (parent, fieldname) => {
      if (this.lang === 'en') return parent[`${fieldname}_en`];
      return parent[fieldname];
    };
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
        <a href="blog">{t('Blogg', 'Blog')}</a>
        <a href="recipes">{t('Recept', 'Recipes')}</a>
        <a href="#">{t('Om mig', 'About me')}</a>
        <a href="#">{t('Kontakt', 'Contact')}</a>
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
            align-items: center;
            justify-content:space-between;
            /*will-change: scroll-position;*/
            top: 0;
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
