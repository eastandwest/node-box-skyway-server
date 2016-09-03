"use strict";

import React from 'react';
import ReactXhr from 'react-xhr';

const BoxFileItems = React.createClass({
  mixins: [ReactXhr.Mixin],

  getInitialState: function() {
    return {
      folder_id: this.props.folderId,
    }
  },

  componentDidMount: function() {
  },
  /////////////////////////////////////
  // xhr setting
  getXhrs: function() {
    return {
      fileItems: {
        url: '/api/folder_info/' + this.state.folder_id,
        method: 'get'
      },
    };
  },
  ////////////////////////////////////////
  // handlers
  handleItemClicked: function(e) {
    let item_id = e.target.dataset.itemid;
    let type = e.target.dataset.type;

    e.preventDefault();

    switch(type) {
      case "folder":
        this.setState({"folder_id": item_id})
        break;
      case "file":
        location.href = "/file/" + item_id;
        break;
      default:
    }
  },

  handlePathClicked: function(e) {
    let folder_id = e.target.dataset.folderid;

    e.preventDefault();
    this.setState({"folder_id": folder_id});
  },
  ////////////////////////////////////////
  // renderings
  renderPath: function(path, key) {
    return (
      <li key={key}>
        <a
          href=""
          data-folderid={path.id}
          onClick={this.handlePathClicked}
        >
          {path.name}
        </a>
      </li>
    )
  },
  renderFileItemNode: function(entry, key) {
    return (
      <li key={key}>
        <a
          data-itemid={entry.id}
          data-type={entry.type}
          onClick={this.handleItemClicked}
          href=""
        >{entry.type}: {entry.name}</a>
      </li>
    )
  },
  render: function() {
    let fileItems = this.state.xhrs.fileItems.body;

    let file_entries = fileItems.entries || [];
    let pathes = file_entries.length !== 0 ? file_entries[0].path_collection.entries : [];

    let self = this;

    // get each components
    // let fileItemNodes = entries.map(this.renderFileItemNode);
    let Path = pathes.map(this.renderPath);

    return(
      <div>
        <div>
          <b>folder path</b><br/>
          <ul>
            {pathes.map(this.renderPath)}
          </ul>
        </div>
        <div>
          <b>items</b><br/>
          <ul>
            {file_entries.map(this.renderFileItemNode)}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = BoxFileItems;
