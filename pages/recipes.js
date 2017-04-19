import React from 'react';

class Recipes extends React.Component {
  render() {
    return <div>{JSON.stringify(this.props.url)}</div>;
  }
}

export default Recipes;
