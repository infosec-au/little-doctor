"use strict";

define({

    isWebRTCEnabled: function() {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            console.log("WebAPIs for WebRTC found");
            navigator.mediaDevices.enumerateDevices().then(this.getDeviceInfo);
            return true;
        } else {
            return false;
        }
    },

    getDeviceInfo: function(deviceInfo) {
        for (var index = 0; index !== deviceInfo.length; index++) {
            console.log(deviceInfo[index]);
        }
    }
});