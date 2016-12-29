module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    'source/css/prestyle.css' : 'source/css/style.scss'
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'build/css/style.css': ['source/css/prestyle.css']
                }
            }
        },
        uglify: {
            options: {
              
            },
            my_target: {
              files: {
                'build/js/lib.min.js': ['source/js/script.js']
              }
            }
        },
        watch: {
            css: {
                files: ['source/css/*.scss', 'source/css/*.css'],
                tasks: ['sass', 'cssmin']
            },
            js:{
                files: 'source/js/*.js',
                tasks: ['uglify']
            },
            livereload: {
              options: { livereload: true },
              files: ['build/**/*'],
            },     
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['watch', 'sass', 'cssmin', 'uglify']);

};
