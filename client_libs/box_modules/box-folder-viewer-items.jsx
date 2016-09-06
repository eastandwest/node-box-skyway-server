"use strict";

import React from 'react';

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

module.exports = BoxFolderViewerItems;
