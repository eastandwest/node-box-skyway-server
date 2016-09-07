"use strict";

import React from 'react';

class BoxUserProfileShared extends React.Component{
  render() {
    return(
      <ul className="userInfo">
        <li><img src={this.props.user_data.avatar_url} /></li>
        <li>{this.props.user_data.name}</li>
      </ul>
    )
  }
};

module.exports = BoxUserProfileShared;
