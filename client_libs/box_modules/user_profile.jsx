"use strict";

import React from 'react';

class BoxUserProfile extends React.Component{
  render() {
    console.log(this.props.user_data);
    return(
      <div className="rn-components">
        <h2>user_info</h2>
        <ul>
          <li><img src={this.props.user_data.avatar_url} /></li>
          <li>{this.props.user_data.name}</li>
        </ul>
      </div>
    )
  }
};

module.exports = BoxUserProfile;
