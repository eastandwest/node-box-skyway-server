"use strict";

import React from 'react';
import ReactXhr from 'react-xhr';

const BoxSlideViewer = React.createClass({
render: function() {

    return (
      <div>
        { /* if viewer src url is obtained, we'll show up file viewer */
          this.props.viewer_src ? (
          <iframe src={this.props.viewer_src} width={this.props.width} height={this.props.height}></iframe>
          ): null
        }
      </div>
    )
  }
})

module.exports = BoxSlideViewer;
