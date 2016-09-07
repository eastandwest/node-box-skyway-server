"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

import BoxUserProfile from './box_modules/user_profile.jsx';
import BoxFileViewerMeta from './box_modules/box-file-viewer-meta.jsx';
import BoxSlideViewer from './box_modules/slide_viewer.jsx';

console.log(g_file_data)

ReactDOM.render(
  <div>
    <BoxUserProfile user_data={g_user_data} />
    <BoxSlideViewer viewer_src={g_file_data.viewer_src} width="640" height="480"/>
    <BoxFileViewerMeta user_data={g_user_data} file_data={g_file_data} />
  </div>,
  document.getElementById('main-contents')
);
