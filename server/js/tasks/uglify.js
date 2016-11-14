"use strict";

module.exports = function(grunt) {

    var module = {

        options: {
            banner: "/* Little Doctor <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n",
            sourceMap: grunt.option("source-map", true)
        },

        littleDoctor: {
            src: [
                "deps/require.js",
                "src/main.js",
            ],
            dest: "./dist/main/little-doctor.js"
        },

        filesystem: {
            src: [
                "src/modules/looters/filesystem.js",
            ],
            dest: "./dist/modules/looters/filesystem.js"
        },

    };

    return module;
};
