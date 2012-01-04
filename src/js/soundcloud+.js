/*jslint browser: true, white: true, regexp: true*/
/*global console*/
(function() {
    'use strict';

    var REGEX = /<meta content="http:\/\/player\.soundcloud\.com.*?(tracks|playlists)%2F(\d+)&amp;/,
        MARKER_CLASSNAME = "soundcloudplus",
        SCAN_INTERVAL = 2000,
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
                        var height = (type === "tracks" ? 81 : 150);

                        console.debug("Adding player for SoundCloud link " + url);
                        $item.after($("<div>").addClass(MARKER_CLASSNAME).append("<object height='" + height + "' width='100%'><param name='movie' value='https://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2F" + type + "%2F" + id + "&amp;show_comments=true&amp;auto_play=false&amp;show_artwork=false&amp;color=ff7700'></param><param name='allowscriptaccess' value='always'></param><param name='wmode' value='transparent'></param><embed allowscriptaccess='always' height='" + height + "' src='https://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2F" + type + "%2F" + id + "&amp;show_comments=true&amp;auto_play=false&amp;show_artwork=false&amp;color=ff7700' type='application/x-shockwave-flash' width='100%' wmode='transparent'></embed></object>"));
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
    }

    $(function() {
        enhance();
        window.setInterval(enhance, SCAN_INTERVAL);
    });
}());
