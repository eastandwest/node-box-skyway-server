"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

import BoxUserProfile from './box_modules/user_profile.jsx';
import BoxFolderViewerItems from './box_modules/box-folder-viewer-items.jsx';

function hashMap(obj) {
  var map = [];

  for ( var key in obj ) {
    map.push(obj[key]);
  }

  return map;
}

const file_datas = hashMap(g_file_datas)
  , user_data = g_user_data;

console.log(file_datas)

function handleItemClicked(item) {
  location.href = "/shared/"+user_data.id+"/" + item.id;
}


ReactDOM.render(
  <div>
    <BoxUserProfile user_data={user_data} />
    <BoxFolderViewerItems items={file_datas} onItemClicked={handleItemClicked} />
  </div>,
  document.getElementById('main-contents')
);
