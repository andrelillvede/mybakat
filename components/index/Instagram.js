import React from 'react';
import image from '../../helpers/image';

class Instagram extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    fetch('/instagram')
      .then(result => result.json())
      .then(json => this.setState({ posts: json }))
      .catch(err => console.error(err));
  }
  render() {
    return (
      <div className="instagram">
        {!this.state.posts
          ? 'could not load instagram images :('
          : this.state.posts.map(post => {
              return (
                <div key={post.code} className="post">
                  <a href={`https://www.instagram.com/p/${post.code}/`}>
                    <img
                      src={image(this.props.cache, post.display_src, 'large')}
                      sizes="25vw"
                      srcSet={`
                        ${image(this.props.cache, post.display_src, 'smallest')} 200w,
                        ${image(this.props.cache, post.display_src, 'small')} 400w,
                        ${image(this.props.cache, post.display_src, 'medium')} 800w,
                        ${image(this.props.cache, post.display_src, 'large')} 1200w
                      `}
                      alt="instagram image"
                    />
                  </a>
                </div>
              );
            })}
        <style jsx>{`
          .instagram {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
          }
          .post {
            width: 30%;
            margin: 2em 0;
          }
          img {
            width: 100%;
            &:hover {
              position:relative;
              top: -10px;
              left: -10px;
              box-shadow: 10px 10px 0px 0px #603913;
            }
          }
          `}</style>
      </div>
    );
  }
}

export default Instagram;
