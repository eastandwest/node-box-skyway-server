"use strict";

import React from 'react';
import ReactXhr from 'react-xhr';

import BoxSlideViewer from './slide_viewer.jsx';

class BoxFileViewerMeta extends React.Component {
  render() {
    const file_data = this.props.file_data;
    const thumbnailurl = '/api/thumbnail/' + file_data.id;
    const qs = 'min_width=32&min_height=32';

    const req = thumbnailurl + '?' + qs;

    return (
      <div>
        <h2><img src={req} /> { file_data.name }</h2>
        <ul>
          <li>description: { file_data.description }</li>
          <li>id: { file_data.id }</li>
          <li>parent folder: { file_data.parent.name }</li>
          <li>parent folder_id: { file_data.parent.id }</li>
        </ul>
      </div>
    )
  }
}

class BoxFileViewerParentLink extends React.Component {
  render() {
    const parent = this.props.parent
      , href="/folder/" + parent.id;
    return (
      <div>
        <a href={href}>back to folder: {parent.name}</a>
      </div>
    )
  }
}

class BoxFileViewer extends React.Component {
  constructor(props) {
    super();

    this.state = {
      file_data: props.file_data,
    }
  }

  render() {
    return(
      <div className="rn-components">
        <BoxFileViewerParentLink parent={this.state.file_data.parent} />
        <BoxSlideViewer file_id={this.state.file_data.id} width="640" height="480" />
        <BoxFileViewerMeta file_data={this.state.file_data} />
      </div>
    );
  }
};

module.exports = BoxFileViewer;
