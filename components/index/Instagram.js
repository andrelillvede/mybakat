import React from 'react';

class Instagram extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    fetch('http://localhost:3000/instagram')
      .then(result => result.json())
      .then(json => this.setState({posts: json}))
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
                    <img src={post.display_src} />
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
          }
          `}</style>
      </div>
    );
  }
}

export default Instagram;
