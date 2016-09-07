"use strict";

import React from 'react';

class BoxUserProfile extends React.Component{
  render() {
    console.log(this.props.user_data);
    return(
      <nav className="navbar navbar-light bg-faded">
        <a className="navbar-brand" href="/folder/0"><h1>InsideShare</h1></a>
        <ul className="nav navbar-nav">
        </ul>
        <form className="form-inline pull-xs-right">
          <input className="form-control" type="text" placeholder="Search Files" />
          <ul className="userInfo">
            <li><img src={this.props.user_data.avatar_url} /></li>
            <li>{this.props.user_data.name}</li>
          </ul>
        </form>
      </nav>
    )
  }
};

module.exports = BoxUserProfile;
