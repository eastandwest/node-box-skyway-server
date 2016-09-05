"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

import BoxUserProfile from './box_modules/user_profile';
import BoxFolderViewer   from './box_modules/folder_viewer';

const folder_id = g_folder_id
  , user_data = g_user_data;

ReactDOM.render(
  <div>
    <BoxUserProfile user_data={user_data} />
    <BoxFolderViewer folderId={folder_id} />
  </div>,
  document.getElementById('main-contents')
);
