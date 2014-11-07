/*
    MediaCenterJS - A NodeJS based mediacenter solution

    Copyright (C) 2014 - Jan Smolders

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var fs = require('fs.extra')
, config = require('../../lib/handlers/configuration-handler').getConfiguration()
, PlayMusic = require('playmusic')
, pm = new PlayMusic();

exports.loadItems = function (req, res) {
    pm.init({email: config.googleUser, password: config.googlePass}, function() {
        pm.getLibrary(function(library) {
            var completeLibrary = library.data.items;
            res.json(completeLibrary);
        });
    });
}

exports.getTracks = function (req,res, albumId){
    pm.getAlbumEntries(albumId, function(data){
        res.json(data);
    }, function(error){
        console.log(error);
    });
}


exports.play = function (req,res, songId){
    console.log('streaming song',songId )
    pm.getStreamUrl(songId, function(streamUrl) {
        res.json(streamUrl);
    });
}
