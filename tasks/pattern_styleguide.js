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
      indexFile     : data.indexFile || options.indexFile || 'index.html',
      patternsDir   : data.patternsDir || options.patternsDir || 'patterns',
      outputDir     : data.outputDir || options.outputDir || 'output'
    };

    // Get the html template
    if(!grunt.file.exists(settings.indexFile)){
      return done(new Error('index file not found...'));
    }
    var indexFile = grunt.file.read(settings.indexFile);

    // Generate the patterns html
    var patternHtml = '';
    if(!grunt.file.exists(settings.patternsDir)) {
      grunt.file.mkdir(settings.patternsDir);
    }
    grunt.file.recurse(settings.patternsDir, function(abspath, rootdir, subdir, filename){
      var patternFile = grunt.file.read(abspath);
      var code = [
        '<div class="pattern-display">',
        patternFile,
        '</div>',
        '<div class="pattern-code">',
        '<textarea>',
        patternFile,
        '</textarea>',
        '</div>'
      ].join('');
      patternHtml += code;
    });

    indexFile = indexFile.replace('<!-- patterns -->', patternHtml);

    grunt.file.write(settings.outputDir + '/index.html', indexFile);

    done();


    // // Merge task-specific and/or target-specific options with these defaults.
    // var options = this.options({
    //   punctuation: '.',
    //   separator: ', '
    // });

    // // Iterate over all specified file groups.
    // this.files.forEach(function(f) {
    //   // Concat specified files.
    //   var src = f.src.filter(function(filepath) {
    //     // Warn on and remove invalid source files (if nonull was set).
    //     if (!grunt.file.exists(filepath)) {
    //       grunt.log.warn('Source file "' + filepath + '" not found.');
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }).map(function(filepath) {
    //     // Read file source.
    //     return grunt.file.read(filepath);
    //   }).join(grunt.util.normalizelf(options.separator));

    //   // Handle options.
    //   src += options.punctuation;

    //   // Write the destination file.
    //   grunt.file.write(f.dest, src);

    //   // Print a success message.
    //   grunt.log.writeln('File "' + f.dest + '" created.');
    // });
  });

};
