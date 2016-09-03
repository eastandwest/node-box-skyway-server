"use strict";

import React from 'react';
import ReactXhr from 'react-xhr';

const BoxFileViewer = React.createClass({
  mixins: [ReactXhr.Mixin],

  getInitialState: function() {
    return {
      file_id: this.props.file_id,
    }
  },

  componentDidMount: function() {
  },
  /////////////////////////////////////
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
    let data = this.state.xhrs.expiring_embed_link.body;
    let viewer_url = data.expiring_embed_link && data.expiring_embed_link.url|| null;
    
    return(
      <div>
      {viewer_url ?
        (<iframe
          src={viewer_url}
          width="640"
          height="480"
          ></iframe>)
        : "" }
      </div>
    );
  }
});

module.exports = BoxFileViewer;
