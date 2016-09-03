"use strict";

const React = require('react');
const ReactDOM = require('react-dom');

const BoxFileViewer = require('./box_modules/file_viewer');

const file_id = g_file_id;

ReactDOM.render(
  <BoxFileViewer file_id={file_id} />,
  document.getElementById('file-viewer')
);
