/*
 *  This file determines what looter modules get loaded
 */

requirejs.config({
    paths: {
        filesystem: 'http://localhost:8888/js/looters/filesystem'
    }
});



requirejs(['filesystem'], function (fs) {
    console.log('Requirejs module loaded');
    fs.execute();
});