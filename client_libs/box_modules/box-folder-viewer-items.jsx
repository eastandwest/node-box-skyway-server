"use strict";

import React from 'react';

class BoxFolderViewerItems extends React.Component {
  handleOnClick(ev, item) {
    ev.preventDefault();
    if(this.props.onItemClicked) this.props.onItemClicked(item);
  }
  render() {
    return (
      <div className="container-fluid-tests">
        <h2>Shared Files</h2>
        <table className="table table-striped folder-view">
          <tbody>
          { this.props.items.map( (item, key) =>{
            const thumbnailurl = '/api/thumbnail/' + item.id;
            const qs = 'min_width=32&min_height=32';
            const req_url = thumbnailurl + "?" + qs;

            return (
              <tr key={key}>
                <td>
                { /* in case of file, we'll show up thubmnail icon image */
                  item.type === "file" ?
                  <img className="ico" src={req_url} /> : <span className="ico fa fa-folder"></span>
                }

                {/* we'll show up file type and name everytime */}
                <a href="" onClick={ (ev) => { this.handleOnClick.bind(this, ev, item)()} }>
                  {item.name}
                </a>
                </td>
              </tr>
            )
          })}
         </tbody>
       </table>
      </div>
    )
  }
}

module.exports = BoxFolderViewerItems;
