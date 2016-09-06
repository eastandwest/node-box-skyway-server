"use strict";

import React from 'react';

class BoxFileViewerParentLink extends React.Component {
  render() {
    const parent = this.props.parent
      , href="/folder/" + parent.id;
    return (
      <div>
        <a href={href}>back to folder: {parent.name}</a>
      </div>
    )
  }
}

module.exports = BoxFileViewerParentLink;
