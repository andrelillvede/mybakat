import React from 'react';
import * as contentful from 'contentful';

const client = contentful.createClient({
  space: 'u7wcr26n3tea',
  accessToken: '29877f03e59850cb986f083f575e7f9532ca1667ca4c5b855739210a74c8cdad',
});

class BlogPosts extends React.Component {
  state = {
    recipes: [],
  };

  componentWillMount() {
    this.lang = this.props.lang;
  }

  componentWillMount() {
    client.getEntries({ content_type: 'recipe', limit: 9 }).then(recipes => {
      this.setState({ recipes: recipes.items });
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
        {!this.state.recipes
          ? 'could not load recipes :('
          : this.state.recipes.map(recipe => {
              return (
                <div key={recipe.sys.id} className="recipe">
                  <a href={`recipes/recipe/${recipe.fields.slug}`}>
                    <img src={recipe.fields.recipe_image.fields.file.url} />
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
