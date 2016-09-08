"use strict";

import React from 'react';
import ReactXhr from 'react-xhr';

import BoxSlideViewer from './slide_viewer.jsx';
import BoxFileViewerParentLink from './box-file-viewer-parent-link.jsx';
import BoxFileViewerMeta from './box-file-viewer-meta.jsx'

import SkyWayVideoChat from '../skyway_modules/video-chat.jsx';

const BoxFileViewer = React.createClass ({
  'mixins': [ReactXhr.Mixin],

  'getInitialState': function() {
    return {
      file_data: this.props.file_data,
    }
  },

  // xhr setting
  getXhrs: function() {
    return {
      expiring_embed_link: {
        url: '/api/expiring_embed_link/' + this.state.file_data.id + '/' + this.props.user_data._box_client_id,
        method: 'get'
      }
    };
  },


  render() {
    const data = this.state.xhrs.expiring_embed_link.body;
    const viewer_src = data.expiring_embed_link && data.expiring_embed_link.url || null;

    return(
      <div className="file-viewer-component">
        <BoxFileViewerParentLink parent={this.state.file_data.parent} />
        <BoxSlideViewer viewer_src={viewer_src} width="640" height="480" />
        <BoxFileViewerMeta file_data={this.state.file_data} user_data={this.props.user_data} />
        <SkyWayVideoChat api_key="7ca63fc0-9e2a-4ee8-af76-16b538f345cb" file_id={g_file_data.id} />
      </div>
    );
  }
});

module.exports = BoxFileViewer;
