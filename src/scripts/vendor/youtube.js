// Youtube video controller
theme.Youtube_videos = new function () {
    // Add these tiny css rules http://www.funkertech.com/windows/w6/sass/bootstrap/_responsive-embed.scss
    // ==> ".embed-responsive" to parent with: ".embed-responsive-16by9" or ".embed-responsive-4by3"
    // ==> ".embed-responsive-item" to video placeholder

    // Should also add custom CSS rules to show/hide cover images or any other elements based on the status data selector
    // ==> ex, .embed-responsive[data-activity-status="playing"], .embed-responsive[data-activity-status="ended"]

    var self = this;

    self.initiated = false;
    self.players = [];
    self.array_videos = [];
    self.lastVideoPlay = null;

    self.selectors = {
        VIDEO : "[data-youtube-id]",
        PARENT : ".embed-responsive",
        TRIGGER : ".embed-video-trigger"
    };

    self.data_selectors = {
        INITIATED : 'initiated',
        YOUTUEB_ID : 'youtubeId',
        STATUS : 'activity-status'
    };

    function youtube_videos () {
        // Only init if there are youtube placeholders on the page
        if (!$(self.selectors.VIDEO).length) return;

        // Attach cover click events
        $(self.selectors.TRIGGER).on("click", function (e) {
            e.preventDefault();
            var current_id = $(this).attr("class").split(' ')[0];
            self.play_video($(this).closest(self.selectors.PARENT), current_id);
            return false;
        })

        // only load script if the widget was not initiated beforehand.
        if (!self.initiated) {
            // add youtube script
            var tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            // wait for youtube activation
            window.onYouTubeIframeAPIReady = self.activation_listner;
        }
    }

    self.play_video = function ($parent, youtubeId) {
        try {
            self.array_videos.forEach(function(video, index) {
                if (video[1] == youtubeId) {
                    var videoDomId = $parent.find(self.selectors.VIDEO).prop("id");
                    if (self.players[videoDomId] != undefined) {
                        if (videoDomId != self.lastVideoPlay && self.lastVideoPlay != null) { // We can run only one video at a time, if another is being played => pause it.
                            self.players[self.lastVideoPlay].player.pauseVideo();
                        }
                        self.players[videoDomId].player.playVideo();
                        self.lastVideoPlay = videoDomId;
                    } else {
                        self.initPlayer(video[0], video[1], video[2], video[3], index);
                        var videoDomId = $parent.find(self.selectors.VIDEO).prop("id");
                    }
                }
            });
        } catch (e) {
            console.log("failed to play video");
            console.log(e.message);
        }
    }

    self.activation_listner = function () {
        self.initiated = true;
        self.iterate();
    }

    self.iterate = function () {
        $(self.selectors.VIDEO).each(function () {
            var videoHolder = $(this);
            if (videoHolder.data(self.data_selectors.INITIATED)) return;

            var youtubeId = videoHolder.data(self.data_selectors.YOUTUEB_ID);
            var hasId = videoHolder.attr('id')? true:false;
            var domId = hasId? videoHolder.prop('id') : 'youtube-placeholder-' + youtubeId; // TODO: replace youtubeId by random generated number from 10000 to 1000000
            if (!hasId) videoHolder.attr('id', domId);

            var showControles = videoHolder.data('controls') || 0;
            var autoplay = videoHolder.data('autoplay') || 0;
            var fullscreenAllowed = videoHolder.data('fs') || 0;
            var releventVideos = videoHolder.data('rel') || 0;
            var loop = videoHolder.data('loop') || 0;

            self.array_videos.push([domId, youtubeId, {
                height: '390',
                width: '640',
                showinfo: 0,
                rel: releventVideos || 0,
                fs: fullscreenAllowed || 0,

                // Afficher les controles de la video en option (data attribute)
                controls: showControles || 0,

                // AutoPlay en option (data attribute), il faut ajouter mute: 1 car navigateur ne permet plus de lancer des videos avec son.
                autoplay: autoplay || 0,
                mute: autoplay || 0,

                // Permettre de lire la video indéfiniment en option (data attribute)
                loop: loop || 0,

                enablejsapi: 1
            }, false ]);

            if (autoplay == 1) {
                self.play_video($("#" + videoHolder.attr('id')).closest(self.selectors.PARENT), youtubeId);
            }
        });
    }

    self.initPlayer = function (domId, videoId, options, isActive, index) {
        if (!isActive) {
            var settings = {
                videoId: videoId,
                events: {
                    'onReady': self.onPlayerReady,
                    'onStateChange': self.onPlayerStateChange
                }
            };

            settings.playerVars = options;
            var player = new YT.Player(domId, settings);

            var updatedSetting = options || {};
            updatedSetting.player = player;
            self.players[domId] = options || {};

            var videoHolder = $(this);
            videoHolder.data(self.data_selectors.INITIATED, true);
            self.array_videos[index][3] = true;
        }
    }

    self.onPlayerReady = function (event) {
        var player = event.target;
        var vidDomId = event.target.a.id;
        var playerSettings = self.players[vidDomId];
        if (vidDomId != self.lastVideoPlay && self.lastVideoPlay != null) {
            self.players[self.lastVideoPlay].player.pauseVideo();
        }
        self.lastVideoPlay = vidDomId;
        player.playVideo();
    }

    self.onPlayerStateChange = function (event) {
        var player = event.target.player;
        var $parent = $(event.target.a).closest(self.selectors.PARENT);
        var playerSettings = self.players[$(player).prop('id')];

        if (event.data == YT.PlayerState.ENDED) {
            $parent.attr(self.data_selectors.STATUS, 'ended');
        } else if (event.data == YT.PlayerState.PLAYING) {
            $parent.attr(self.data_selectors.STATUS, 'playing');
        } else if (event.data == YT.PlayerState.PAUSED) {
            $parent.attr(self.data_selectors.STATUS, 'paused');
        } else if (event.data == YT.PlayerState.BUFFERING) {
            $parent.attr(self.data_selectors.STATUS, 'buffering');
        } else if (event.data == YT.PlayerState.CUED) {
            $parent.attr(self.data_selectors.STATUS, 'cued');
        }
    }

    return youtube_videos;
}
  
