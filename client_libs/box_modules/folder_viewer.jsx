"use strict";

import React from 'react';
import ReactXhr from 'react-xhr';

import BoxFolderViewerItems from './box-folder-viewer-items.jsx';
import BoxFolderViewerPath from './box-folder-viewer-path.jsx';


const BoxFolderViewer = React.createClass({
  mixins:  [ReactXhr.Mixin],

  // initiallize
  getInitialState: function() {
    return {
      folder_id : this.props.folderId,
    }
  },
  // xhr setting
  getXhrs: function() {
    return {
      fileItems: {
        url: '/api/folder_info/' + this.state.folder_id,
        method: 'get'
      },
    };
  },

  // handler settings
  handleItemClicked: function(item) {
    switch(item.type) {
      case "folder":
        // let's change url inside omnibar
        // fixme : popState does not work now.
        if(window.history && window.history.pushState) window.history.pushState("", "", "/folder/" + item.id)

        this.setState({"folder_id": item.id})
        break;
      case "file":
        // move to file page
        // fixme : move as SPA
        location.href = "/file/" + item.id;
        break;
      default:
    }
  },
  handlePathClicked: function(path) {
    // let's change url inside omnibar
    // fixme : popState does not work now.
    if(window.history && window.history.pushState) window.history.pushState("", "", "/folder/" + path.id)

    this.setState({"folder_id": path.id});
  },

  ////////////////////////////////////////
  // renderings
  render: function() {
    const fileItems = this.state.xhrs.fileItems.body;

    const file_entries = fileItems.entries || [];
    const pathes = file_entries.length !== 0 ? file_entries[0].path_collection.entries : [];

    return(
      <div className="rn-components">
        <BoxFolderViewerPath pathes={pathes} onPathClicked={this.handlePathClicked} />
        <BoxFolderViewerItems items={file_entries} onItemClicked={this.handleItemClicked} />
      </div>
    );
  }
});

module.exports = BoxFolderViewer;
