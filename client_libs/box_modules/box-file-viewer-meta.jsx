"use strict";

import React from 'react';
import $ from 'jquery';


class BoxFileViewerMeta extends React.Component {
  onCheckBoxClicked(ev, props) {
    const doShare = ev.target.checked;

    $.ajaxSetup( {"contentType": "application/json"} )

    $.post("/api/share/" + props.user_data.id, JSON.stringify({
      user_data: props.user_data,
      file_data: props.file_data,
      doShare: doShare
    }), (err, res) => {
      console.log(err,res);
    })
  }
  onFormSubmitted(ev, props) {
    ev.preventDefault();
    $.ajaxSetup( {"contentType": "application/json"} )

    $.post( "/api/sendMail/" + props.user_data.id + "/" + props.file_data.id, JSON.stringify({
      "toemail": "kensaku.komatsu@gmail.com"
    }));
  }
  render() {
    const file_data = this.props.file_data;

    console.log(file_data);
    const thumbnailurl = '/api/thumbnail/' + file_data.id;
    const sharedUrl = '/shared/' + this.props.user_data.id;
    const qs = 'min_width=32&min_height=32';

    const req = thumbnailurl + '?' + qs;

    return (
      <div className="file-meta-container">
        <h2><img src={req} /> { file_data.name }</h2>
        <ul className="file-meta">
          <li>description: { file_data.description }</li>
          <li>id: { file_data.id }</li>
          <li>parent folder: { file_data.parent.name }</li>
          <li>parent folder_id: { file_data.parent.id }</li>
          <li><a href={ file_data.viewer_src }>viewer_url</a></li>
          <li><a href={ sharedUrl }>shared contents page</a></li>
        </ul>
        { file_data.shared ? "" : (
        <form className="form-inline" onSubmit={ (ev) => this.onFormSubmitted.bind(this, ev, this.props)()}>
          <label>
            <input type="checkbox" name="share" onClick={
              (ev) => this.onCheckBoxClicked.bind(this, ev, this.props)()
            }/> share it as temporal
          </label><br />
          <div className="form-group">
          Send temporal link by SendGrid  
          <input type="email" value="kensaku.komatsu@gmail.com" className="form-control metamail" id="exampleInputEmail3" placeholder="Enter email" />  
          <button type="submit" className="btn btn-primary">send</button>
          </div>
        </form>) }
      </div>
    )
  }
}

module.exports = BoxFileViewerMeta;
