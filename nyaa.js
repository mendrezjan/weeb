var Q = require('q');
var request = require("request");
var cheerio = require('cheerio');
var chalk = require('chalk');

module.exports = {
  search: function(query) {
    var torrent_search = query;
    var search_query = torrent_search.split(' ').join('+');

    var search_url = "https://www.nyaa.se" + "/?page=search&term=" + search_query + "&sort=2";

    var count = 1;
    var deferred = Q.defer();
    var data_content = {};
    var torrent_content = [];

    request(search_url, function(err, response, body){

      if(!err && response.statusCode === 200){

        $ = cheerio.load(body);

        if($('.tlist').find('tr').length > "2"){
          $('.tlist tr.tlistrow').each(function(index, torrents){

            find_torrent_title = $(torrents).find('.tlistname a');
            find_torrent_link = $(torrents).find('.tlistdownload a');
            find_torrent_seed = $(torrents).find('.tlistsn');
            find_torrent_leech = $(torrents).find('.tlistln');
            find_torrent_size = $(torrents).find('.tlistsize');

            torrent_title = find_torrent_title.text();
            torrent_link = find_torrent_link.attr('href');
            torrent_seed = find_torrent_seed.text();
            torrent_leech = find_torrent_leech.text();
            torrent_size = find_torrent_size.text();

            data_content = {
              torrent_num: count,
              title: torrent_title,
              category: "",
              seeds: torrent_seed,
              leechs: torrent_leech,
              size: torrent_size,
              torrent_link: torrent_link
            };
            torrent_content.push(data_content);

            deferred.resolve(torrent_content);
            if (++count > 20) { return false; }

          });
        } else {
          deferred.reject(chalk.red('[-] ') + "No torrents found.");
        }
      } else {
        deferred.reject(chalk.red('[-] ') + "There was a problem loading Nyaa.");
      }


    });

    return deferred.promise;

  }
};
