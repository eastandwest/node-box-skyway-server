"use strict";

import React from 'react';

navigator._getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia;

const SkyWayVideoChat = React.createClass({
  getInitialState: function() {
    return {
      peer: null,
      videos: [],
      status: 'idle',
      style : {
        border: "1px solid #333",
        width: "320px",
        height: "240px"
      },
      stream: null
    }
  },

  handleBtnClicked: function() {
    const peer = new Peer({key: this.props.api_key});
    this.state.status = 'connecting';

    peer.on("open", (peer_id) => {
      this.state.status = 'connected';
      this.setState({"peer": peer});
      this.startGUM(peer_id);
    });
  },

  startGUM: function(peer_id) {
    navigator._getUserMedia({"video": true, "audio": true}, (stream) => {
      const video = {
        "peer_id": peer_id,
        "src": window.URL.createObjectURL(stream)
      }

      const videos = this.state.videos;
      videos.push(video);

      this.setState({"videos": videos, "stream": stream});

      this.joinRoom();
    }, err => {
      console.warn(err);
    })
  },

  joinRoom: function() {
    const meshRoom = this.state.peer.joinRoom(this.props.file_id, {
      mode: 'mesh', stream: this.state.stream
    });
    meshRoom.on('stream', (stream) => {
      const streamURL = URL.createObjectURL(stream);
      const remoteId = stream.peerId;

      const video = {
        "peer_id": remoteId,
        "src": window.URL.createObjectURL(stream)
      }

      const videos = this.state.videos;
      videos.push(video);

      this.setState({"videos": videos});
    });
    meshRoom.on('peerLeave', (peerId) => {
      const videos = [];

      for(let key in this.state.videos) {
        let video = this.state.videos[key];

        if(video.peer_id !== peerId) videos.push(video);
      }
      this.setState({"videos": videos});
    });
  },


  render: function() {
    return (
      <div className="skyway-video-chat">
        {this.state.videos.map((video, key) => {
          return (
            <div><video key={key} style={this.state.style} src={video.src} autoPlay></video></div>
          )
        })}
        {this.state.status === 'idle' ? <button type="button" onClick={this.handleBtnClicked} className="btn btn-info">start video chat</button> : ''}
      </div>
    )
  }
});

module.exports=SkyWayVideoChat;
