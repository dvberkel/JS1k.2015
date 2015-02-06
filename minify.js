var q = require('q');
var fs = require('q-io/fs');
var path = require('path')
var compressor = require('node-minify');

[
    { 'type': 'gcc', 'options': [] },
    { 'type': 'yui-js', 'options': [] },
    { 'type': 'uglifyjs', 'options': [] }
].forEach(function(data){
    var path = 'JS1k-' + data.type + '.js';
    console.log(path);
    new compressor.minify({
        type: data.type,
        fileIn: 'JS1k.js',
        fileOut: path,
        options: data.options,
        callback: function(error, min){
            if (error) {
                throw error;
            }
        }
    });
});
