"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import ReactXhr from 'react-xhr';

import BoxUserProfile from './box_modules/user_profile.jsx';
import BoxUserProfileShared from './box_modules/user-profile-shared.jsx';
import BoxFileViewerMeta from './box_modules/box-file-viewer-meta.jsx';
import BoxSlideViewer from './box_modules/slide_viewer.jsx';

console.log(g_file_data)

const BoxSlideSharedViewer = React.createClass({
  'mixins': [ReactXhr.Mixin],

  getInitialState: function() {
    return {
      file_data: this.props.file_data,
      user_data: this.props.user_data,
    }
  },

  // xhr setting
  getXhrs: function() {
    return {
      expiring_embed_link: {
        url: '/api/expiring_embed_link/' + this.state.file_data.id + '/' + this.state.user_data._box_client_id,
        method: 'get'
      }
    };
  },
  render: function() {
    const data = this.state.xhrs.expiring_embed_link.body;
    const viewer_src = data.expiring_embed_link && data.expiring_embed_link.url || null;

    return (
      <BoxSlideViewer viewer_src={viewer_src} width="640" height="480"/>
    )
  }
})

ReactDOM.render(
  <div>
    <BoxUserProfile user_data="" />
    <BoxUserProfileShared user_data={g_user_data} />
    <BoxSlideSharedViewer user_data={g_user_data} file_data={g_file_data} width="640" height="480"/>
    <BoxFileViewerMeta user_data={g_user_data} file_data={g_file_data} />
  </div>,
  document.getElementById('main-contents')
);
