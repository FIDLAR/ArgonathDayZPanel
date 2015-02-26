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
		clean: ["assets/css/", "assets/js"]
	});
	
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['clean', 'cssmin', 'uglify:min']);
	grunt.registerTask('monitor', ['watch']);
};