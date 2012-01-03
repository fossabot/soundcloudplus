/*jslint browser: true, white: true, regexp: true*/
/*global console*/
(function() {
    'use strict';

    var REGEX = /<meta content="http:\/\/player\.soundcloud\.com.*?tracks%2F(\d+)&amp;/,
        MARKER_CLASSNAME = "soundcloudplus",
        SCAN_INTERVAL = 2000,
        cache = {};

    function getTrackId(url, callback) {
        $.get(url, function(data) {
            var matches = REGEX.exec(data);

            if (matches !== null && matches.length > 1) {
                callback(parseInt(matches[1], 10));
            } else {
                callback(null);
            }
        });
    }

    function enhance() {
        var $links = $(".B-u-C");

        $links.each(function(index, item) {
            var $item = $(item),
                $a = $item.find("a[href^='http://soundcloud.com/']");

            if ($a.size() === 1) {
                var url = $a.attr("href");

                // Only add player if we haven't already added it
                if ($item.siblings("." + MARKER_CLASSNAME).size() === 0) {

                    var addPlayer = function(id) {
                        console.debug("Adding player for SoundCloud link " + url);
                        $item.after($("<div>").addClass(MARKER_CLASSNAME).append("<object height='81' width='100%'><param name='movie' value='https://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" + id + "&amp;show_comments=true&amp;auto_play=false&amp;color=ff7700'></param><param name='allowscriptaccess' value='always'></param><param name='wmode' value='transparent'></param><embed allowscriptaccess='always' height='81' src='https://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" + id + "&amp;show_comments=true&amp;auto_play=false&amp;color=ff7700' type='application/x-shockwave-flash' width='100%' wmode='transparent'></embed></object>"));
                    };

                    if (cache[url] !== undefined && cache[url] !== null) {
                        console.debug("Found id of " + url + " in cache");
                        addPlayer(cache[url]);
                    } else {
                        getTrackId(url, function(id) {
                            if (id === null) {
                                console.error("Couldn't determine track id for " + url);
                            }
                            // getTrackId() may be a time consuming process so here we make sure again that the player hasn't been added already
                            else if ($item.siblings("." + MARKER_CLASSNAME).size() === 0) {
                                cache[url] = id;
                                addPlayer(id);
                            }
                        });
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
