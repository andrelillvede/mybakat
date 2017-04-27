import React from 'react';
import * as contentful from 'contentful';
import Fuse from 'fuse.js';
import { t, l } from '../../helpers/translation.js';
import find from 'lodash.find';
import classNames from 'classnames';

const client = contentful.createClient({
  space: 'u7wcr26n3tea',
  accessToken: '29877f03e59850cb986f083f575e7f9532ca1667ca4c5b855739210a74c8cdad',
});

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      show: true,
      result: [],
    };

    this.search = this.search.bind(this);
    this.highlight = this.highlight.bind(this);
  }

  componentWillMount() {
    this.lang = this.props.lang;
  }

  componentDidMount() {
    console.time('getPosts');
    client.getEntries({ content_type: 'blogPost' }).then(posts => {
      const arr = posts.items.map(post => ({
        title: l(this.lang, post.fields, 'title'),
        description: l(this.lang, post.fields, 'description'),
      }));

      const options = {
        include: ['matches'],
        keys: [
          {
            name: 'title',
            weight: 0.7,
          },
          {
            name: 'description',
            weight: 0.3,
          },
        ],
      };
      const fuse = new Fuse(arr, options);
      this.setState({ fuse: fuse, loaded: true });
      console.timeEnd('getPosts');
    });
  }

  search({ target: { value } }) {
    this.setState({
      result: this.state.fuse.search(value),
    });
  }

  highlight(text, matches) {
    if (!matches) return text;
    console.log(text, matches);
    var result = [];
    // var matches = [[1, 3], [6, 8]] // assume these are the matched indices
    var pair = matches.shift();
    // Build the formatted string
    for (var i = 0; i < text.length; i++) {
      var char = text.charAt(i);
      if (pair && i == pair[0]) {
        result.push('<b>');
      }
      result.push(char);
      if (pair && i == pair[1]) {
        result.push('</b>');
        pair = matches.shift();
      }
    }
    return result.join('');
  }
  render() {
    const searchClasses = classNames({
      search: true,
      show: this.state.show,
    });
    return (
      <div className={searchClasses}>
        <input onChange={this.search} type="text" />
        <div>
          {this.state.result.map(post => {
            const matches = key => {
              const result = find(post.matches, { key: key });
              if (result && result.indices) return result.indices;
            };
            return (
              <div style={{ marginBottom: '2em' }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.highlight(post.item.title, matches('title')),
                  }}
                />
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.highlight(
                      post.item.description,
                      matches('description')
                    ),
                  }}
                />
              </div>
            );
          })}
        </div>
        <style jsx>{`
          .search {
            display: none;
          }
          .show {
            display: inline-block;
          }
          :global(b) {
            color: green;
          }
        `}</style>
      </div>
    );
  }
}

export default Search;
