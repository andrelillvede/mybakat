import React from 'react';
import { initGA, logPageView } from '../helpers/ga';

class Recipes extends React.Component {
  componentDidMount() {
    initGA();
    logPageView();
  }
  render() {
    return <div>{JSON.stringify(this.props.url)}</div>;
  }
}

export default Recipes;
