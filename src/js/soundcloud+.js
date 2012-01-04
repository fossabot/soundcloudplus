/*jslint browser: true, white: true, regexp: true*/
/*global console, chrome, DefaultTrackPlayer, DefaultPlaylistPlayer, Html5TrackPlayer, Html5PlaylistPlayer*/
(function() {
    "use strict";

    var REGEX = /<meta content="http:\/\/player\.soundcloud\.com.*?(tracks|playlists)%2F(\d+)&amp;/,
        MARKER_CLASSNAME = "soundcloudplus",
        SCAN_INTERVAL = 2000,
        PLAYERS = {
            "tracks": {
                "flash": DefaultTrackPlayer,
                "html5": Html5TrackPlayer
            },
            "playlists": {
                "flash": DefaultPlaylistPlayer,
                "html5": Html5PlaylistPlayer
            }
        },
        cache = {};

    function getTrackId(url, callback) {
        $.get(url, function(data) {
            var matches = REGEX.exec(data);

            if (matches !== null && matches.length > 2) {
                callback(matches[1], parseInt(matches[2], 10));
            } else {
                callback(null, null);
            }
        });
    }

    function enhance() {
        chrome.extension.sendRequest({action: "getLocalStorage"}, function(localStorage) {
            // Wait until options have been set
            if (!localStorage.playerType) {
                return;
            }

            var $links = $(".B-u-C");

            $links.each(function(index, item) {
                var $item = $(item),
                    $a = $item.find("a[href^='http://soundcloud.com/'], a[href^='http://m.soundcloud.com/']");

                if ($a.size() === 1) {
                    var url = $a.attr("href").replace(/m\.soundcloud\.com/g, "soundcloud.com");

                    // Only add player if we haven't already added it
                    // or if there wasn't a previous error when retrieving the id for that url
                    if (cache[url] !== null && $item.siblings("." + MARKER_CLASSNAME).size() === 0) {

                        var addPlayer = function(type, id) {
                            console.debug("Adding player for SoundCloud link " + url);
                            
                            var player = new PLAYERS[type][localStorage.playerType](id);
                            player.showComments = localStorage.showComments;
                            $item.after($("<div>").addClass(MARKER_CLASSNAME).append(player.getHtml()));
                        };

                        if (cache[url] === undefined) {
                            getTrackId(url, function(type, id) {
                                if (id === null) {
                                    cache[url] = null;
                                    console.error("Couldn't determine track id for " + url);
                                }
                                // getTrackId() may be a time consuming process so here we make sure again that the player hasn't been added already
                                else if ($item.siblings("." + MARKER_CLASSNAME).size() === 0) {
                                    cache[url] = {"type": type, "id": id};
                                    addPlayer(type, id);
                                }
                            });
                        } else {
                            console.debug("Found id of " + url + " in cache");
                            addPlayer(cache[url].type, cache[url].id);
                        }

                    }
                }
            });
        });
    }

    enhance();
    window.setInterval(enhance, SCAN_INTERVAL);

}());
