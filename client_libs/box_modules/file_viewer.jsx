"use strict";

import React from 'react';
import ReactXhr from 'react-xhr';

import $ from 'jquery';
import BoxSlideViewer from './slide_viewer.jsx';

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
  onFormSubmitted(ev) {
    ev.preventDefault();

  }
  render() {
    const file_data = this.props.file_data;
    const thumbnailurl = '/api/thumbnail/' + file_data.id;
    const sharedUrl = '/shared/' + this.props.user_data.id;
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
          <li><a href={ file_data.viewer_src }>viewer_url</a></li>
          <li><a href={ sharedUrl }>shared contents page</a></li>
        </ul>
        <form onSubmit={this.onFormSubmitted}>
          <label>
            <input type="checkbox" name="share" onClick={
              (ev) => this.onCheckBoxClicked.bind(this, ev, this.props)()
            }/> share it as temporal
          </label><br />

          <p>send temporal link for this page by SendGrid.</p>
          <textarea></textarea><br />
          <button type="submit">send</button>
        </form>
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

const BoxFileViewer = React.createClass ({
  'mixins': [ReactXhr.Mixin],

  'getInitialState': function() {
    return {
      file_data: this.props.file_data,
    }
  },

  // xhr setting
  getXhrs: function() {
    return {
      expiring_embed_link: {
        url: '/api/expiring_embed_link/' + this.state.file_data.id,
        method: 'get'
      }
    };
  },


  render() {
    const data = this.state.xhrs.expiring_embed_link.body;
    this.state.file_data.viewer_src = data.expiring_embed_link && data.expiring_embed_link.url|| null;
    return(
      <div className="rn-components">
        <BoxFileViewerParentLink parent={this.state.file_data.parent} />
        <BoxSlideViewer viewer_src={this.state.file_data.viewer_src} width="640" height="480" />
        <BoxFileViewerMeta file_data={this.state.file_data} user_data={this.props.user_data} />
      </div>
    );
  }
});

module.exports = BoxFileViewer;
