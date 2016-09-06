"use strict";

import React from 'react';

class BoxFolderViewerPath extends React.Component {
  handleOnClick(ev, path) {
    ev.preventDefault();
    if(this.props.onPathClicked) this.props.onPathClicked(path);
  }
  render() {
    const pathes = this.props.pathes;
    return(
      <div>
        <h2>Path info</h2>
        <ul>
        { pathes.map( (path, key) => {
          const href = "/folder/" + path.id;
          return (
            <li key={key}>
              <a href={href} onClick={ (ev) => { this.handleOnClick.bind(this, ev, path)(); } }>{path.name}</a>
            </li>
          )
        })}
        </ul>
      </div>
    )
  }
}

module.exports = BoxFolderViewerPath;
