var Q = require('q');
var os = require('os');
var fs = require('fs');
var http = require('http');
var chalk = require('chalk');


module.exports = {
  download: function(url, filename){
    var dest = os.tmpdir() + "/" + filename + ".torrent";
    var cb;

    var download = function(url, dest, cb) {
      var file = fs.createWriteStream(dest);
      var request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
          file.close(cb);
          console.log(chalk.green('[+] ') + "Torrent file downloaded.");
          torrentfile = dest;
         });
      }).on('error', function(err) {
        fs.unlink(dest);
        if (cb) cb(err.message);

      });
    }
    download(url, dest, cb);
  }
}