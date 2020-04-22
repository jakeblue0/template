/// <binding BeforeBuild='min:site' Clean='clean, min' ProjectOpened='watch' />
"use strict";

const
    gulp = require("gulp"),
    pump = require('pump'),
    notify = require('gulp-notify'),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    postcss = require("gulp-postcss"),
    htmlmin = require("gulp-minify-html"),
    purgecss = require("gulp-purgecss"),
    imagemin = require("gulp-imagemin"),
    svgo = require("gulp-svgo"),
    sass = require("gulp-sass");

sass.compiler = require('node-sass');

const webroot = './';

const bundles = {
    site: {
        js: {
            outputFileName: webroot + 'dist/js/site.min.js',
            inputFiles: [
                webroot + 'src/js/site.js'
            ]
        },
        css: {
            outputFileName: webroot + 'dist/css/site.min.css',
            inputFiles: [
                webroot + 'src/scss/**/*.scss'
            ],
            configuration: 'tailwind.config.js'
        },
        svg: {
            outputDirectory: webroot + 'dist/img/',
            inputFiles: [
                webroot + 'src/img/**/*.svg',
                webroot + 'src/img/**/*.png',
                webroot + 'src/img/**/*.jpeg',
                webroot + 'src/img/**/*.gif'
            ]
        },
        html: {
            outputDirectory: webroot + 'dist/',
            inputFiles: [
                webroot + 'src/html/**/*.html'
            ]
        }
    },
    main: {
        js: {
            outputFileName: webroot + 'dist/lib/main.min.js',
            inputFiles: [
                webroot + 'src/lib/jquery/jquery-3.4.1.min.js'

            ]
        },
        css: {
            outputFileName: webroot + 'dist/lib/main.min.css',
            inputFiles: [

            ]
        }
    }
};

const errorHandler = function (error) {
    if (typeof error !== 'undefined')
        notify({
            title: "Gulp",
            message: error
        }).write(error);
};

function minifyCSS(bundle) {
    if (bundle.inputFiles.length > 0)
        pump([
            gulp.src(bundle.inputFiles),
            sass(),
            postcss([
                require('tailwindcss')
            ]),
            concat(bundle.outputFileName),
            purgecss({
                content: [].concat(
                    bundles.site.html.inputFiles,
                    bundles.site.js.inputFiles,
                    bundles.main.js.inputFiles
                ),
                whitelistPatterns: [/fp-[a-zA-Z0-9]+$/],
                defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
            }),
            cssmin(),
            gulp.dest('.')
        ], errorHandler);
}

function minifyJS(bundle) {
    if (bundle.inputFiles.length > 0)
        pump([
            gulp.src(bundle.inputFiles),
            concat(bundle.outputFileName),
            uglify(),
            gulp.dest('.')
        ], errorHandler);
}

function minifysvg(bundle) {
    if (bundle.inputFiles.length > 0)
        pump([
            gulp.src(bundle.inputFiles),
            svgo(),
            imagemin(),
            gulp.dest(bundle.outputDirectory)
        ], errorHandler);
}

function minifyHtml(bundle) {
    if (bundle.inputFiles.length > 0)
        pump([
            gulp.src(bundle.inputFiles),
            htmlmin(),
            gulp.dest(bundle.outputDirectory)
        ], errorHandler);
}

gulp.task('min:site:css', function (done) {
    minifyCSS(bundles.site.css);
    done();
});

gulp.task('min:main:css', function (done) {
    minifyCSS(bundles.main.css);
    done();
});

gulp.task('min:site:js', function (done) {
    minifyJS(bundles.site.js);
    done();
});

gulp.task('min:site:svg', function (done) {
    minifysvg(bundles.site.svg);
    done();
});

gulp.task('min:site:html', function (done) {
    minifyHtml(bundles.site.html);
    done();
});

gulp.task('min:main:js', function (done) {
    minifyJS(bundles.main.js);
    done();
});

gulp.task('watch', function () {
    gulp.watch([].concat(
        bundles.site.css.inputFiles,
        bundles.site.css.configuration,
        bundles.site.html.inputFiles
    ), gulp.series('min:site:html', 'min:site:css'));
    gulp.watch(bundles.site.css.inputFiles, gulp.series('min:site:css'));
    gulp.watch(bundles.site.svg.inputFiles, gulp.series('min:site:svg'));
    gulp.watch(bundles.site.js.inputFiles, gulp.series('min:site:js'));
});

gulp.task('min:site', gulp.parallel('min:site:css', 'min:site:js', 'min:site:html', 'min:site:svg'));
gulp.task('min:main', gulp.parallel('min:main:css', 'min:main:js'));
gulp.task('min', gulp.parallel('min:site', 'min:main'));