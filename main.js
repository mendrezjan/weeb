var nyaa = require('./nyaa');
var inquirer = require('inquirer');
var Q = require('q');
var chalk = require('chalk');
var os = require('os');
var fs = require('fs');
var http = require('http');
var query = '';
var peerflix_player = "--mpv";
var dl = require('./dl')
var torrentfile;
var spawn = require('cross-spawn-async');

function Start() {
  'use strict';
  inquirer.prompt([
    {
      type: 'input',
      message: 'Anime you want to watch: ',
      name: 'name'
    }
  ]).then(function (answers) {
    query = answers.name;
    nyaa.search(query).then(
      function(data){
        onResolve(data);
      }, function(err) {
        onReject(err);
        console.log(chalk.red('[-] ') + 'Can\'t help you right now.');
      }
    );
  });
}

function onResolve(data) {
  selectTorrent(data);
}

function onReject(err) {
  console.log(err);
}

function selectTorrent(data) {
  var choices = [];
  var deferred = Q.defer();
  for (var idx in data) {
    var torrent = data[idx];
    var title = torrent.title;
    var seeds = torrent.seeds;
    var size = torrent.size;
    var number = torrent.torrent_num;
    choices.push(title);
    choices.push({name: chalk.gray(seeds) + ' ' + chalk.gray(size), disabled: 'Info'});
  }
  var select_torrent = "Press enter to choose torrent.";
  var questions = [
    {
      type: 'list',
      name: 'torrent',
      message: select_torrent,
      choices: choices,
    }
  ];
  inquirer.prompt(questions).then(function (answer){
    torrent_title = answer.torrent;
    var url;
	var filename;
    var torrent = data.map(function(link){
      if (link.title === torrent_title) {
        url = 'http:' + link.torrent_link;
        filename = link.title;
        torrentfile = os.tmpdir() + "/" + filename + ".torrent";
        dl.download(url, filename);
      }
    });

    setTimeout(streamTorrent, 3000);

  });
}

function streamTorrent(){
	var argsList = [torrentfile, peerflix_player]
	spawn('peerflix', argsList, {stdio: 'inherit'});
}

Start(query);
