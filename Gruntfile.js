module.exports = function(grunt) {
	grunt.initConfig({
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'src/css',
					src: ['*.css', '!*.min.css'],
					dest: 'assets/css',
					ext: '.min.css'
				}]
			}
		},
		uglify: {
			min: {
				files: grunt.file.expandMapping(['src/js/**/*.js'], 'assets/js/', {
			    		flatten: true,
			        		rename: function(destBase, destPath) {
			            		return destBase+destPath.replace('.js', '.min.js');
			        		}
			    	})
			}
		},
		watch: {
			scripts: {
				files: 'src/js/**/*.js',
				tasks: ['uglify:min']
			}
		},
		clean: ["assets/css/", "assets/js/", "config/"],
		replace: {
			production: {
				src: ['src/config/settings.js'],
				dest: 'config/settings.js',
				overwrite: false,
				replacements: [{
					from: 'localhost:3000',
					to: 'dayz.argonathrpg.com'
				}, {
					from: '0.0.0.0',
					to: '188.165.158.113'
				}]
			},
			dev: {
				src: ['src/config/settings.js'],
				dest: 'config/settings.js',
				overwrite: false,
				replacements: [{
					from: 'localhost',
					to: 'localhost:3000'
				}, {
					from: '0.0.0.0',
					to: '127.0.0.1'
				}]
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-text-replace');

	grunt.registerTask('default', ['clean', 'cssmin', 'uglify:min', 'replace:dev']);
	grunt.registerTask('production', ['clean', 'cssmin', 'uglify:min', 'replace:production']);
	grunt.registerTask('monitor', ['watch']);
};