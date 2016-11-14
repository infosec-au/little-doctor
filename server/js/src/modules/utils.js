"use strict";


define({

    POST: function(data, path, callbacks) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200 && callbacks.success && typeof callbacks.success === 'function') {
                    callbacks.success(xhr.responseText);
                } else if (callbacks.failure && typeof callbacks.failure === 'function') {
                    callbacks.failure(xhr.responseText);
                }
            }
        }
        if (path.length && path[0] !== '/') {
            path = '/' + path;
        }
        var uri = server + path;
        console.log('POST -> ' + uri);
        xhr.open('POST', uri, true);
        xhr.send(data);
    },

    GET: function(path, callbacks) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200 && callbacks.success && typeof callbacks.success === 'function') {
                    callbacks.success(xhr.responseText);
                } else if (callbacks.failure && typeof callbacks.failure === 'function') {
                    callbacks.failure(xhr.responseText);
                }
            }
        }
        if (path.length && path[0] !== '/') {
            path = '/' + path;
        }
        var uri = server + path;
        console.log('GET -> ' + uri);
        xhr.open('GET', uri, true);
        xhr.send(null);
    }

});