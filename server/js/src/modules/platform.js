"use strict";


define({

    operatingSystem: function() {

        var agent = navigator.userAgent;

        if (agent.indexOf("Macintosh") > -1) {
            return "macos";
        } else if (agent.indexOf("iPhone") > -1 || agent.indexOf("iPad") > -1 || agent.indexOf("iPod") > -1) {
            return "ios";
        } else if (agent.indexOf("Windows") > -1) {
            return "windows";
        } else if (agent.indexOf("Android") > -1) {
            return "android";
        } else if (agent.indexOf("Linux") > -1 || agent.indexOf("X11") > -1) {
            return "linux";
        } else {
            return null;
        }

    },

    browser: function() {
        var agent = navigator.userAgent;

        if (agent.indexOf("Opera") > -1) {
            return "opera";
        } else if (agent.indexOf("Chrome") > -1) {
            return "chrome";
        } else if (agent.indexOf("Safari") > -1) {
            return "safari";
        } else if (agent.indexOf("Firefox") > -1) {
            return "firefox";
        } else if (agent.indexOf("MSIE") > -1 || agent.indexOf("Trident") > -1) {
            return "internet-explorer";
        } else if (agent.indexOf("Edge") > -1) {
            return "edge";
        } else {
            return null;
        }

    }

});