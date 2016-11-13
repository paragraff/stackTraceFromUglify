module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', ['concat', 'uglify', 'connect']);
	grunt.initConfig({
		concat: {
			options: {
				sourceMap: true
			},
			dist: {
				src: ['src/file1.js', 'src/file2.js', 'src/app.js'],
				dest: 'dest/built.js'
			}
		},
		uglify: {
			built: {
				options: {
					sourceMap: true,
					sourceMapIn: 'dest/built.js.map',
					sourceMapIncludeSources: false
				},
				files: {
					'dest/built.min.js': ['dest/built.js']
				}
			}
		},
		connect: {
			server: {
				options: {
					port: 8000,
					hostname: 'stacktrace-test.com',
					base: 'dest',
					keepalive: true,
					open: true
				}
			}
		}
	});
};
