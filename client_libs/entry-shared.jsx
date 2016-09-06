"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

import BoxUserProfile from './box_modules/user_profile.jsx';

const file_datas = g_file_datas
  , user_data = g_user_data;

ReactDOM.render(
  <div>
    <BoxUserProfile user_data={user_data} />
  </div>,
  document.getElementById('main-contents')
);
