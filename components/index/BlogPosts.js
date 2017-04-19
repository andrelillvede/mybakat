import React from 'react';
import * as contentful from 'contentful';

const client = contentful.createClient({
  space: 'u7wcr26n3tea',
  accessToken: '29877f03e59850cb986f083f575e7f9532ca1667ca4c5b855739210a74c8cdad',
});

class BlogPosts extends React.Component {
  state = {
    posts: [],
  };

  componentWillMount() {
    this.lang = this.props.lang;
  }

  componentWillMount() {
    client.getEntries({ content_type: 'blogPost', limit: 9 }).then(posts => {
      this.setState({ posts: posts.items });
    });
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
    return (
      <div className="blog">
        {!this.state.posts
          ? 'could not load blog posts :('
          : this.state.posts.map(post => {
              return (
                <div key={post.sys.id} className="post">
                  <a href={`blog/posts/${post.fields.slug}`}>
                    <img src={post.fields.post_image.fields.file.url} />
                    {l(post.fields, 'title')}
                  </a>
                </div>
              );
            })}
        <style jsx>{`
          .blog {
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

export default BlogPosts;
