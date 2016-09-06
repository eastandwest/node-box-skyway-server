"use strict";

import React    from 'react';
import ReactDOM from 'react-dom';

import BoxUserProfile from './box_modules/user_profile.jsx';
import BoxFileViewer  from './box_modules/file_viewer.jsx';

const file_data = g_file_data;
const user_data = g_user_data;

ReactDOM.render(
  <div>
    <BoxUserProfile user_data={user_data} />
    <BoxFileViewer file_data={file_data} user_data={user_data} />
  </div>,
  document.getElementById('main-contents')
);
