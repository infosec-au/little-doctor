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
            dest: "./dist/little-doctor.min.js"
        },

        filesystem: {
            src: [
                "src/looters/filesystem.js",
            ],
            dest: "./dist/looters/filesystem.js"
        },

    };

    return module;
};
