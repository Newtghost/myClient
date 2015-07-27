
(function () {

    'use strict';

    /*global require*/
    var gulp = require('gulp'),

        inject = require('gulp-inject'),

        angularFilesort = require('gulp-angular-filesort'), // Allow to sort scripts in the correct order

        wiredep = require('wiredep').stream,

        util = require('util'),

        browserSync = require('browser-sync'),

        modRewrite  = require('connect-modrewrite'),

        del  = require('del'),

        paths = {
            src: 'src',
            tmp: '.tmp',
            dist: 'dist'
        };

    gulp.task('clean', function (done) {
        del([paths.dist + '/', paths.tmp + '/'], done);
    });

    gulp.task('inject', ['html'], function () {

        var target = gulp.src(paths.src + '/app/index.html'),

            sourcesStyles = gulp.src([
                paths.src + '/app/**/*.css'
            ], {read: false}),

            sourcesScripts = gulp.src([
                paths.src + '/app/**/*.js'
            ]).pipe(angularFilesort()),

            wiredepOptions = {
                directory: 'bower_components'
            };

        return target
            .pipe(inject(sourcesStyles)) // CSS
            .pipe(inject(sourcesScripts)) // Scripts
            .pipe(wiredep(wiredepOptions)) // Bower dependencies
            .pipe(gulp.dest(paths.tmp + '/serve/'));
    });

    function browserSyncInit(baseDir, files) {
        browserSync.instance = browserSync.init(files, {
            startPath: '/',
            server: {
                baseDir: baseDir,
                routes: { /* A quoi ça sert ? Ca fonctionne plus sans ça... */
                    '/bower_components': 'bower_components',
                    '/src': 'src'
                }
            },
            browser: 'default' /* Quoi d'autre ? */
        });
    }

    /* Pas ouf de cop*/
    gulp.task('html', ['clean'], function () {
        return gulp.src(paths.src + '/app/request*')
            .pipe(gulp.dest(paths.tmp + '/serve/'));
    });

    gulp.task('serve', ['inject'], function () {
        browserSyncInit(
            [ /* Différence avec routes ? */
                paths.tmp + '/serve',
                paths.src
            ],
            [
                paths.src + '/app/**/*.css',
                paths.src + '/app/**/*.js',
                paths.src + 'src/assets/images/**/*',
                paths.tmp + '/serve/*.html',
                paths.tmp + '/serve/app/**/*.html',
                paths.src + '/app/**/*.html'
            ]
        );
    });

}());
