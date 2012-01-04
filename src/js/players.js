/*jslint browser: true, white: true*/
(function() {
    'use strict';

    function BasePlayer() {
        this.id = 0;
        this.height = 81;
        this.color = "ff7700";
        this.autoPlay = false;
        this.html = null;
    }

    BasePlayer.prototype.buildProperties = function() {
        return {
            "ID": this.id,
            "HEIGHT": this.height,
            "COLOR": this.color,
            "AUTOPLAY": this.autoPlay
        };
    };

    BasePlayer.prototype.getHtml = function() {
        var props = this.buildProperties(),
            prop = null,
            html = this.html;

        for (prop in props) {
            if (props.hasOwnProperty(prop)) {
                var regex = new RegExp("\\[\\[" + prop + "\\]\\]", "g");
                html = html.replace(regex, props[prop]);
            }
        }

        return html;
    };



    function DefaultTrackPlayer(id) {
        this.id = id;
        this.showComments = true;
        this.html = "<object height='[[HEIGHT]]' width='100%'><param name='movie' value='https://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F[[ID]]&amp;show_comments=[[SHOW_COMMENTS]]&amp;auto_play=[[AUTOPLAY]]&amp;color=[[COLOR]]'></param><param name='allowscriptaccess' value='always'></param><param name='wmode' value='transparent'></param><embed allowscriptaccess='always' height='[[HEIGHT]]' src='https://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F[[ID]]&amp;show_comments=[[SHOW_COMMENTS]]&amp;auto_play=[[AUTOPLAY]]&amp;color=[[COLOR]]' type='application/x-shockwave-flash' width='100%' wmode='transparent'></embed></object>";
    }

    DefaultTrackPlayer.prototype = new BasePlayer();
    DefaultTrackPlayer.prototype.constructor = DefaultTrackPlayer;

    DefaultTrackPlayer.prototype.buildProperties = function() {
        var props = BasePlayer.prototype.buildProperties.call(this);
        props.SHOW_COMMENTS = this.showComments;
        return props;
    };



    function DefaultPlaylistPlayer(id) {
        this.id = id;
        this.height = 150;
        this.showArtwork = false;
        this.showPlayCount = true;
        this.html = "<object height='[[HEIGHT]]' width='100%'><param name='movie' value='https://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F[[ID]]&amp;show_comments=[[SHOW_COMMENTS]]&amp;auto_play=[[AUTOPLAY]]&amp;show_playcount=[[SHOW_PLAYCOUNT]]&amp;show_artwork=[[SHOW_ARTWORK]]&amp;color=[[COLOR]]'></param><param name='allowscriptaccess' value='always'></param><param name='wmode' value='transparent'></param><embed allowscriptaccess='always' height='[[HEIGHT]]' src='https://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F[[ID]]&amp;show_comments=[[SHOW_COMMENTS]]&amp;auto_play=[[AUTOPLAY]]&amp;show_playcount=[[SHOW_PLAYCOUNT]]&amp;show_artwork=[[SHOW_ARTWORK]]&amp;color=[[COLOR]]' type='application/x-shockwave-flash' width='100%' wmode='transparent'></embed></object>";
    }

    DefaultPlaylistPlayer.prototype = new DefaultTrackPlayer();
    DefaultPlaylistPlayer.prototype.constructor = DefaultPlaylistPlayer;

    DefaultPlaylistPlayer.prototype.buildProperties = function() {
        var props = DefaultTrackPlayer.prototype.buildProperties.call(this);
        props.SHOW_ARTWORK = this.showArtwork;
        props.SHOW_PLAYCOUNT = this.showPlayCount;
        return props;
    };



    function Html5TrackPlayer(id) {
        this.id = id;
        this.height = 166;
        this.showArtwork = false;
        this.html = "<iframe width='100%' height='[[HEIGHT]]' scrolling='no' frameborder='no' src='http://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F[[ID]]&amp;auto_play=[[AUTOPLAY]]&amp;show_artwork=[[SHOW_ARTWORK]]&amp;color=[[COLOR]]'></iframe>";
    }

    Html5TrackPlayer.prototype = new DefaultTrackPlayer();
    Html5TrackPlayer.prototype.constructor = Html5TrackPlayer;

    Html5TrackPlayer.prototype.buildProperties = function() {
        var props = DefaultTrackPlayer.prototype.buildProperties.call(this);
        props.SHOW_ARTWORK = this.showArtwork;
        return props;
    };



    function Html5PlaylistPlayer(id) {
        this.id = id;
        this.height = 450;
        this.html = "<iframe width='100%' height='[[HEIGHT]]' scrolling='no' frameborder='no' src='http://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F[[ID]]&amp;auto_play=[[AUTOPLAY]]&amp;show_artwork=[[SHOW_ARTWORK]]&amp;color=[[COLOR]]'></iframe>";
    }

    Html5PlaylistPlayer.prototype = new DefaultPlaylistPlayer();
    Html5PlaylistPlayer.prototype.constructor = Html5PlaylistPlayer;


    // exports
    window.DefaultTrackPlayer = DefaultTrackPlayer;
    window.DefaultPlaylistPlayer = DefaultPlaylistPlayer;
    window.Html5TrackPlayer = Html5TrackPlayer;
    window.Html5PlaylistPlayer = Html5PlaylistPlayer;

}());
