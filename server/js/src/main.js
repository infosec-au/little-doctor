/*
 *  This file determines what looter modules get loaded
 */

var scheme = '__LITTLE_DOCTOR_SCHEME__://';
var hostname = '__LITTLE_DOCTOR_HOSTNAME__:__LITTLE_DOCTOR_LISTEN_PORT__';

requirejs.config({
    paths: {
        filesystem: scheme + hostname + '/modules/looters/filesystem'
    }
});

requirejs(['filesystem'], function (fs) {
    console.log('Requirejs module loaded');
    fs.execute();
});