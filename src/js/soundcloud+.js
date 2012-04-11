/*jslint browser: true, white: true, regexp: true*/
/*global $, console, chrome*/
(function() {
    'use strict';

    var REGEX = /https?:\/\/(?:(?:m\.)?((?:soundcloud.com\/[\w\-]+\/[\w\-]+)|(?:snd.sc\/\w+)))\/?/,
        MARKER_CLASSNAME = 'soundcloudplus',
        cache = {};

    function getEmbed(url, localStorage, callback) {
        $.ajax('https://soundcloud.com/oembed', {
            type: 'GET',
            data: {
                url: url,
                format: 'json',
                color: localStorage.color,
                show_comments: localStorage.showComments
            },
            dataType: 'json',
            success: function(data) {
                callback(data.html);
            },
            error: function() {
                callback(null);
            }
        });
    }

    function enhance() {
        chrome.extension.sendRequest({action: 'getLocalStorage'}, function(localStorage) {
            // Wait until options have been set
            if (!localStorage.color) {
                return;
            }

            var $links = $('.ICACWc');

            $links.each(function(index, item) {
                var $item = $(item),
                    $a = $item.find('a[href]').filter(function() {
                        return $(this).attr('href').match(REGEX);
                    }),
                    url,
                    addPlayer;

                if ($a.size() > 0) {
                    url = 'http://' + REGEX.exec($a.attr('href'))[1];

                    // Only add player if we haven't already added it
                    // or if there wasn't a previous error when retrieving the id for that url
                    if (cache[url] !== null && !$item.hasClass(MARKER_CLASSNAME)) {

                        addPlayer = function(html) {
                            console.debug('Adding player for SoundCloud link ' + url);
                            var $html = $(html);
                            $html.filter('object').attr('wmode', 'opaque');
                            $item.empty();
                            $item.addClass(MARKER_CLASSNAME).append($html);
                        };

                        if (cache[url] === undefined) {
                            getEmbed(url, localStorage, function(html) {
                                if (html === null) {
                                    cache[url] = null;
                                    console.error('Couldn\'t determine embed for ' + url);
                                }
                                // getEmbed() may be a time consuming process so here we make sure again that the player hasn't been added already
                                else if ($item.parent().siblings('.' + MARKER_CLASSNAME).size() === 0) {
                                    cache[url] = html;
                                    addPlayer(html);
                                }
                            });
                        } else {
                            console.debug('Found embed of ' + url + ' in cache');
                            addPlayer(cache[url]);
                        }
                    }
                }
            });
        });
    }

    $('#contentPane').bind('DOMNodeInserted', enhance);

}());
