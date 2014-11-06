4/*
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

/* Modules */
var express = require('express')
, app = express()
, fs = require('fs.extra')
, config = require('../../lib/handlers/configuration-handler').getConfiguration()
, deviceInfo = require('../../lib/utils/device-utils')
, functions = require('./google-music-functions');

// Choose your render engine. The default choice is JADE:  http://jade-lang.com/
exports.engine = 'jade';

exports.index = function(req, res, next){
    deviceInfo.isDeviceAllowed(req, function(allowed){
        res.render('GoogleMusic', {
            title: 'GoogleMusic',
            selectedTheme: config.theme,
            allowed: allowed
        });
    });
};

exports.get = function(req, res, next){
    var infoRequest = req.params.id
    , optionalParam = req.params.optionalParam
    , action = req.params.action;

    if (infoRequest == 'load'){
        functions.loadItems(req,res);
    }
}

