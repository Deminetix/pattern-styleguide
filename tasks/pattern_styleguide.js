/*
 * grunt-pattern-styleguide
 * https://github.com/Deminetix/pattern-styleguide
 *
 * Copyright (c) 2014 Ash Connell
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('pattern_styleguide', 'Converts pattern files into an HTML/CSS styleguide', function() {
    var done = this.async();
    var data = this.data;
    var options = this.options();

    var settings = {
      indexTemplate   : data.indexTemplate || options.indexTemplate || 'index.html',
      patternTemplate : data.patternTemplate || options.patternTemplate || 'pattern.html',
      patternsDir     : data.patternsDir || options.patternsDir || 'patterns',
      outputDir       : data.outputDir || options.outputDir || 'output'
    };

    // Get the html template
    if(!grunt.file.exists(settings.indexTemplate)){
      return done(new Error('index template not found...'));
    }
    var indexTemplate = grunt.file.read(settings.indexTemplate);

    // Get the pattern template
    if(!grunt.file.exists(settings.patternTemplate)){
      return done(new Error('pattern template not found...'));
    }
    var patternTemplate = grunt.file.read(settings.patternTemplate);

    // Generate the patterns html
    var patternHtml = '';
    if(!grunt.file.exists(settings.patternsDir)) {
      grunt.file.mkdir(settings.patternsDir);
    }
    grunt.file.recurse(settings.patternsDir, function(abspath, rootdir, subdir, filename){
      var patternContent = grunt.file.read(abspath);
      var pattern = patternTemplate.replace(/<!-- pattern -->/g, patternContent);
      patternHtml += pattern;
    });

    indexTemplate = indexTemplate.replace('<!-- patterns -->', patternHtml);

    grunt.file.write(settings.outputDir + '/index.html', indexTemplate);

    done();

  });

};
