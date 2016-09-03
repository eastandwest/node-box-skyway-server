"use strict";

const React = require('react');
const ReactDOM = require('react-dom');

const BoxFileItems = require('./box_modules/file_items');

const folder_id = g_folder_id;

ReactDOM.render(
  <BoxFileItems folderId={folder_id}/>,
  document.getElementById('example')
);
