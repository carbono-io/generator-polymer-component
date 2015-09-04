'use strict';
var path = require('path');
var util = require('util');

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _     = require('lodash');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the exceptional ' + chalk.red('PolymerComponent') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'The name of your component',
      default: path.basename(process.cwd()),
      validate: function (name) {

          var isValid = (name.split('-').length > 1);

          var errorMessage = util.format('It must have a `-` (dash) character.', name);

          // Return true (Boolean) for valid and String for invalid.
          return isValid ? true : errorMessage;
      },
    }];

    this.prompt(prompts, function (options) {
      this.options = options;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {

      var name = this.options.name;

      var files = {
        'package.json': 'package.json',
        'bower.json': 'bower.json',
        'src/base-polymer-component.html': 'src/' + name + '.html',
        'src/base-polymer-component.js': 'src/' + name + '.js',
        'src/base-polymer-component.less': 'src/' + name + '.less',
        'demo/index.html': 'demo/index.html',
        'demo/src.html': 'demo/src.html',
        'demo/vulcanized.html': 'demo/vulcanized.html',
      };

      _.each(files, function (dest, src) {
        this.fs.copyTpl(this.templatePath(src), this.destinationPath(dest), this.options);
      }.bind(this));
    },

    projectfiles: function () {

      var files = [
        'gulpfile.js',
        '.gitignore',
        'README.md',
      ];

      files.forEach(function (f) {
        this.fs.copy(this.templatePath(f), this.destinationPath(f), this.options);
      }.bind(this));
    }
  },

  install: function () {
    this.installDependencies();
  }
});
