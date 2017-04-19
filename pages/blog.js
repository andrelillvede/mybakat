import React from 'react';

class Recipe extends React.Component {
  render() {
    return <div>{JSON.stringify(this.props.url)}</div>;
  }
}

export default Recipe;
