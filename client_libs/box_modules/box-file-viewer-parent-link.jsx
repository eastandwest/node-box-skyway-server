"use strict";

import React from 'react';

class BoxFileViewerParentLink extends React.Component {
  render() {
    const parent = this.props.parent
      , href="/folder/" + parent.id;
    return (
      <div className="backlink">
        <a href={href}>&laquo; {parent.name}</a>
      </div>
    )
  }
}

module.exports = BoxFileViewerParentLink;
