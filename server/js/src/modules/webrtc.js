"use strict";

define(['utils', 'msr'], function(utils) {

    console.log('Loaded WebRTC module');

    return {

        execute: function(audio, video) {
            var mediaConstraints = {
                audio: audio === undefined ? true : audio, 
                video: video === undefined ? true : video
            };
            console.log('Starting WebRTC recording ...');
            console.log(mediaConstraints);
            navigator.getUserMedia(mediaConstraints, this.onMediaSuccess, this.onMediaError);
        },

        onMediaError: function(e) {
            console.error('media error', e);
        },

        onMediaSuccess: function(stream) {
            var mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'video/webm';
            var _this = this;
            mediaRecorder.ondataavailable = function(blob) {
                console.log('WebRTC data available, uploading to server ...');
                requirejs(['utils'], function(utils) {
                    var blobURL = URL.createObjectURL(blob);
                    var stamp = new Date().toString();
                    utils.uploadFile('webrtc - ' + stamp + '.blob', blobURL, {
                        success: function() {
                            console.log('Uploaded webrtc blob to server');
                        }
                    });
                });
            };
            mediaRecorder.start(3000);
        }
    }

});