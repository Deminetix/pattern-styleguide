/*
 * grunt-pattern-styleguide
 * https://github.com/Deminetix/pattern-styleguide
 *
 * Copyright (c) 2014 Ash Connell
 * Licensed under the MIT license.
 */

'use strict';

var _     = require('underscore');
var jade  = require('jade');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('pattern_styleguide', 'Converts pattern files into an HTML/CSS styleguide', function() {
    var done = this.async();
    var data = this.data;
    var options = this.options();

    var settings = {
      indexTemplate   : data.indexTemplate || options.indexTemplate || 'index.jade',
      patternTemplate : data.patternTemplate || options.patternTemplate || 'pattern.jade',
      patternsDir     : data.patternsDir || options.patternsDir || 'patterns',
      outputDir       : data.outputDir || options.outputDir || 'output'
    };

    // Get the html template
    if(!grunt.file.exists(settings.indexTemplate)){
      return done(new Error('index template not found...'));
    }
    var indexTemplate = jade.render(grunt.file.read(settings.indexTemplate));

    // Get the pattern template
    if(!grunt.file.exists(settings.patternTemplate)){
      return done(new Error('pattern template not found...'));
    }
    var patternTemplate = jade.render(grunt.file.read(settings.patternTemplate));

    // Generate the patterns html
    var patternBuild = '';
    if(!grunt.file.exists(settings.patternsDir)) {
      grunt.file.mkdir(settings.patternsDir);
    }
    grunt.file.recurse(settings.patternsDir, function(abspath, rootdir, subdir, filename){
      var output;
      var patternJade = grunt.file.read(abspath);
      var patternHtml = jade.render(patternJade);
      output = patternTemplate.replace('<!-- pattern-jade -->', patternJade);
      output = output.replace('<!-- pattern-html -->', patternHtml);
      patternBuild += output;
    });

    indexTemplate = indexTemplate.replace('<!-- patterns -->', patternBuild);

    grunt.file.write(settings.outputDir + '/index.html', indexTemplate);

    done();

  });

};
