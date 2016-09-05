"use strict";

import React from 'react';
import ReactXhr from 'react-xhr';

import BoxSlideViewer from './slide_viewer';

class BoxFolderViewerPath extends React.Component {
  handleOnClick(ev, path) {
    ev.preventDefault();
    if(this.props.onPathClicked) this.props.onPathClicked(path);
  }
  render() {
    const pathes = this.props.pathes;
    return(
      <div>
        <h2>Path info</h2>
        <ul>
        { pathes.map( (path, key) => {
          const href = "/folder/" + path.id;
          return (
            <li key={key}>
              <a href={href} onClick={ (ev) => { this.handleOnClick.bind(this, ev, path)(); } }>{path.name}</a>
            </li>
          )
        })}
        </ul>
      </div>
    )
  }
}

class BoxFolderViewerItems extends React.Component {
  handleOnClick(ev, item) {
    ev.preventDefault();
    if(this.props.onItemClicked) this.props.onItemClicked(item);
  }
  render() {
    return (
      <div>
        <h2>Items view</h2>
        <ul>
        { this.props.items.map( (item, key) =>{
          const thumbnailurl = '/api/thumbnail/' + item.id;
          const qs = 'min_width=32&min_height=32';
          const req_url = thumbnailurl + "?" + qs;

          return (
            <li key={key}>
              { /* in case of file, we'll show up small slide viewer */
                item.type === "file" ?
                <div><BoxSlideViewer file_id={item.id} width="128" height="160" /></div> : ""
              }

              { /* in case of file, we'll show up thubmnail icon image */
                item.type === "file" ?
                <img src={req_url} /> : ""
              }

              {/* we'll show up file type and name everytime */}
              <a href="" onClick={ (ev) => { this.handleOnClick.bind(this, ev, item)()} }>
                {item.type}: {item.name}
              </a>
            </li>
          )
        })}
        </ul>
      </div>
    )
  }
}

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
