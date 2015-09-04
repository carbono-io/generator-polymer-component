var path = require('path');
var fs   = require('fs');

var gulp        = require('gulp');
var gulpReplace = require('gulp-replace');
var gulpRename  = require('gulp-rename');
var gulpIf      = require('gulp-if');
var gulpSize    = require('gulp-size');
var git         = require('gulp-git');
var del         = require('del');

var TMP_DIR = './tmp';
var APP_TPL_DIR = './generators/app/templates';

/**
 * Updates the base repo
 */
gulp.task('update', function (done) {

    var cloneOptions = {
        args: TMP_DIR,
    };

    // Clone git
    git.clone('git@bitbucket.org:carbonoio/base-polymer-component.git', cloneOptions, function (err) {

        // Remove .git dir
        del.sync(TMP_DIR + '/.git');

        if (!err) {
            done(err)
        }

        function isGitIgnore(file) {
            return path.basename(file.path) === '.gitignore';
        }

        gulp.src(TMP_DIR + '/**/*', { dot: true })
            .pipe(gulpReplace('base-polymer-component', '<%= name %>'))
            .pipe(gulpIf(isGitIgnore, gulpRename('_gitignore')))
            .pipe(gulpSize())
            .pipe(gulp.dest(APP_TPL_DIR))
            .on('end', function () {
                del.sync(TMP_DIR);
            });
    });

});

gulp.task('default', ['update']);