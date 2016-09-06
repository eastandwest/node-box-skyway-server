"use strict";

import React from 'react';
import ReactXhr from 'react-xhr';

const BoxSlideViewer = React.createClass({
  'mixins': [ReactXhr.Mixin],

  // xhr setting
  getXhrs: function() {
    return {
      expiring_embed_link: {
        url: '/api/expiring_embed_link/' + this.props.file_id,
        method: 'get'
      }
    };
  },
  render: function() {
    const data = this.state.xhrs.expiring_embed_link.body;
    const viewer_src = data.expiring_embed_link && data.expiring_embed_link.url|| null;

    return (
      <div>
        { /* if viewer src url is obtained, we'll show up file viewer */ 
          viewer_src ? (
          <iframe src={viewer_src} width={this.props.width} height={this.props.height}></iframe>
          ): null
        }
      </div>
    )
  }
})

module.exports = BoxSlideViewer;
