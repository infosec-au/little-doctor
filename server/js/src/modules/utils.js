"use strict";


define({

    POST: function(path, data, callbacks, headers) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200 && callbacks.success ) {
                    callbacks.success(xhr.responseText);
                } else if (callbacks.failure) {
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
        for (var property in headers) {
            if (headers.hasOwnProperty(property)) {
                console.log('Request header ' + property + ': ' + headers[property]);
                xhr.setRequestHeader(property, headers[property]);
            }
        }
        xhr.send(data);
    },

    GET: function(path, callbacks, headers) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200 && callbacks.success) {
                    callbacks.success(xhr.responseText);
                } else if (callbacks.failure) {
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
        for (var property in headers) {
            if (headers.hasOwnProperty(property)) {
                console.log('Request header ' + property + ': ' + headers[property]);
                xhr.setRequestHeader(property, headers[property]);
            }
        }
        xhr.send(null);
    },

    uploadFile: function(filename, data, callbacks) {
        this.POST('/upload', data, {
            success: function(data) {
                if (callbacks.success) {
                    callbacks.success(data);
                }
            },
            failure: function() {
                if (callbacks.failure) {
                    callbacks.failure();
                }
            }
        }, {
            'X-Filename': filename
        });
    }

});