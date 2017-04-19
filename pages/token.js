import React from 'react';

class Token extends React.Component {
  state = {
    location: ''
  }
  componentDidMount(){
    this.setState({
      location: window.location.href
    })

    let token = window.location.hash.split('=')[1];
    this.setState({
      token
    })
  }
  render() {
    return (
      <div>
        <a href={`https://api.instagram.com/oauth/authorize/?scope=public_content&client_id=6f7b5c91ffdd4d6691d400ca171a1a61&redirect_uri=${this.state.location}&response_type=token`}>get token</a>
        <div>{!this.state.token ? 'click link to get token!' : `token: ${this.state.token}`}</div>
      </div>
    );
  }

}

export default Token;
