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
        <ol className="breadcrumb">
        { pathes.map( (path, key) => {
          const href = "/folder/" + path.id;
          return (
            <li className="breadcrumb-item" key={key}>
              <a href={href} onClick={ (ev) => { this.handleOnClick.bind(this, ev, path)(); } }>{path.name}</a>
            </li>
          )
        })}
        </ol>
      </div>
    )
  }
}

module.exports = BoxFolderViewerPath;
