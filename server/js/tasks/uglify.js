"use strict";

module.exports = function(grunt) {

    var module = {

        options: {
            banner: "/* Little Doctor <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n",
            sourceMap: grunt.option("source-map", true)
        },

        // Primary modules
        littleDoctor: {
            src: [
                "deps/require.js",
                "src/main.js",
            ],
            dest: "./dist/main/little-doctor.js"
        },

        utils: {
            src: [
                "src/modules/utils.js",
            ],
            dest: "./dist/modules/utils.js"
        },

        filesystem: {
            src: [
                "src/modules/filesystem.js",
            ],
            dest: "./dist/modules/filesystem.js"
        },

        webrtc: {
            src: [
                "src/modules/webrtc.js",
            ],
            dest: "./dist/modules/webrtc.js"
        },

        msr: {
            src: [
                "node_modules/msr/MediaStreamRecorder.min.js"
            ],
            dest: "./dist/modules/dependencies/msr.js"
        },

        platform: {
            src: [
                "src/modules/platform.js"
            ],
            dest: "./dist/modules/platform.js"
        },

        // Loot modules
        lootFiles: {
            src: [
                "src/modules/looters/files.js"
            ],
            dest: "./dist/modules/looters/files.js"
        },

        // Propagation modules
        propagateRocketChat: {
            src: [
                "src/modules/propagation/rocketchat.js"
            ],
            dest: "./dist/modules/propagation/rocketchat.js"
        }

    };

    return module;
};
