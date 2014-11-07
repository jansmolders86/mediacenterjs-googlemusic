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
'use strict';

var musicApp = angular.module('GoogleMusicApp', ['angular.filter', 'ngRoute']);

musicApp.config(['$routeProvider',
function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'views/main.html',
        controller: 'GoogleMusicCtrl'
    }).
    when('/tracks/:albumId', {
        templateUrl: 'views/tracks.html',
        controller: 'GoogleMusicTrackCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
}]);

musicApp.controller('GoogleMusicCtrl', function($scope, $http, $filter) {
        $http.get('/googlemusic/load').success(function(data) {
            $scope.albums =  data;
        });

        var setupSocket = {
            async: function() {
                var promise = $http.get('/configuration/').then(function (response) {
                    var configData  = response.data;
                    var socket      = io.connect();
                    socket.on('connect', function(data){
                        socket.emit('screen');
                    });
                    return {
                        on: function (eventName, callback) {
                            socket.on(eventName, function () {
                                var args = arguments;
                                $scope.$apply(function () {
                                    callback.apply(socket, args);
                                });
                            });

                        },
                        emit: function (eventName, data, callback) {
                            socket.emit(eventName, data, function () {
                                var args = arguments;
                                $scope.$apply(function () {
                                    if (callback) {
                                        callback.apply(socket, args);
                                    }
                                });
                            });
                        }
                    };
                    return data;
                });
                return promise;
            }
        };


        setupSocket.async().then(function(data) {
            if (typeof data.on !== "undefined") {
                $scope.remote       = remote(data, $scope);
                $scope.keyevents    = keyevents(data, $scope);
            }
        });


});

musicApp.factory('audio', function($document) {
    var audio = $document[0].createElement('audio');
    return audio;
});


musicApp.controller('GoogleMusicTrackCtrl', function($scope, $http, $filter, $routeParams, audio) {
    var albumId = $routeParams.albumId;

    $http.get('/googlemusic/loadTracks/'+albumId).success(function(data) {
            $scope.tracks =  data;

            $scope.playSong = function(songId){
                $http.get('/googlemusic/play/'+songId).success(function(data) {
                    audio.src = data;
                    audio.play();
                });
            }
    });

});


