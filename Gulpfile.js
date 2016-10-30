'use strict';

var fs = require('fs');
var pkg = JSON.parse( fs.readFileSync('./package.json') );
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var plugins = require('gulp-load-plugins')();
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var size = require('gulp-check-filesize');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var insert = require('gulp-insert');

var build = {
  filename: 'rekord-vue.js',
  minified: 'rekord-vue.min.js',
  output: './build/',
  include: [
    './src/vue.js'
  ]
};

var comments = [
  "/*", pkg.name, pkg.version, '-', pkg.description, 'by', pkg.author, "*/\n"
];

var executeMinifiedBuild = function(props)
{
  return function() {
    return gulp
      .src( props.output + props.filename )
      .pipe( rename( props.minified ) )
      .pipe( sourcemaps.init() )
        .pipe( plugins.uglify().on('error', gutil.log) )
        .pipe( insert.prepend( comments.join(' ') ) )
      .pipe( sourcemaps.write('.') )
      .pipe( size({enableGzip: true}) )
      .pipe( gulp.dest( props.output ) )
    ;
  };
};

var executeBuild = function(props)
{
  return function() {
    return gulp
      .src( props.include )
      .pipe( plugins.concat( props.filename ) )
      .pipe( insert.prepend( comments.join(' ') ) )
      .pipe( size({enableGzip: true}) )
      .pipe( gulp.dest( props.output ) )
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'))
    ;
  };
};

gulp.task('lint', function() {
  return gulp
    .src(build.output + build.filename)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
  ;
});

gulp.task( 'js', executeBuild( build ) );
gulp.task( 'js:min', ['js'], executeMinifiedBuild( build ) );

gulp.task( 'default', ['js:min']);
