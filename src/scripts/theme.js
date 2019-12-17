window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
// =require slate/a11y.js
// =require slate/cart.js
// =require slate/utils.js
// =require slate/rte.js
// =require slate/sections.js
// =require slate/currency.js
// =require slate/images.js
// =require slate/variants.js

/*================ Sections ================*/
// =require sections/product.js

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js

$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('product', theme.Product);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
});

/////Menu Mobile Toogle

  $(document).ready(function(){
      $("#hamburger").click(function(){
        $("#menu-mobile").animate({width: 'toggle'});
        $(".fadding__filter").fadeIn();
      });
    });

$(document).ready(function(){
      $("#cross").click(function(){
        $("#menu-mobile").animate({width: 'toggle'});
        $(".fadding__filter").fadeOut();
      });
});


/////page experts pop-up

$('[data-video-open]').on('click', function() {
    $(this).closest('.block-image-text').next('[data-video-popup]').toggle();
    $('.block-image-text').addClass('block__opacity');
})

$('[data-video-close]').on('click', function() {
    $(this).closest('[data-video-popup]').toggle();
    $('.block-image-text').removeClass('block__opacity');
})



/////Ingredients toggle


$(document).ready(function() {

      $("[data-scroll-plus]").click(function() {
          if ($('[data-ingredients-text]').is(':visible')) {
          $("[data-ingredients-text]").slideUp(600);
        }

        if($(this).next("[data-ingredients-text]").is(':visible')) {
          $("[data-ingredients-text]").slideUp(300);

        }else {
          $(this).next("[data-ingredients-text]").slideDown(600);
               }
             });
  });

///footer__menu

// $( "[data-accordion-trigger]" ).click(function() {
//   $("[data-accordion-panel]").slideToggle( "slow");
// });


$(document).ready(function() {
      $("[data-menu-trigger]").click(function() {
          if ($('[data-footer-panel]').is(':visible')) {
          $("[data-footer-panel]").slideUp(600);
          $(".arrow-right").removeClass("arrow-rotate");
        }

        if($(this).next("[data-footer-panel]").is(':visible')) {
          $("[data-footer-panel]").slideUp(300);
          $(".arrow-right").removeClass("arrow-rotate");

        }else {
          $(this).next("[data-footer-panel]").slideDown(600);
          $(".arrow-right").addClass("arrow-rotate");
               }
             });
  });

// Inspiration: https://www.w3.org/TR/wai-aria-practices/examples/accordion/js/accordion.js
// feature: data-allow-toggle
// Allow for each toggle to both open and close its section. Makes it possible for all sections to be closed. Assumes only one section may be open.

// feature: data-allow-multiple
// Allow for multiple accordion sections to be expanded at the same time. Assumes data-allow-toggle otherwise the toggle on open sections would be disabled.
// __________

// Ex:
// <div id="accordionGroup" data-accordion>
// <div id="accordionGroup" data-accordion data-allow-multiple>
// <div id="accordionGroup" data-accordion data-allow-toggle></div>

theme.accordion = (function () {
    'use strict';

    var selectors = {
        root   : "[data-accordion]",
        trigger: "[data-accordion-trigger]",
        panel  : "[data-accordion-panel]"
    }

    var features = {
        allow_multiple : "[data-allow-multiple]",
        allow_toggle   : "[data-allow-toggle]"
    }

    var data = {
        target_id: 'aria-controls'
    }

    var states = {
        expanded: {
            attr_name: 'aria-expanded',
            attr_values : {
                yes: "true",
                no:  "false"
            }
        },
        disabled: {
            attr_name: 'aria-disabled',
            attr_values : {
                yes: "true",
                no:  "false"
            }
        }
    }

    $(selectors.root).each(function () {
        var $accordion = $(this);
        init($accordion);
    });

    function init ($accordion) {
        var allowsMultiple = $accordion.is(features.allow_multiple);
        var options = {
            allowsMultiple: allowsMultiple,
            allowToggle: (allowsMultiple) ? allowsMultiple : $accordion.is(features.allow_toggle)
        }

        $accordion.on("click", selectors.trigger, function (e) {
            e.preventDefault();
            trigger($(this), $accordion, options);
        });

        $accordion.on('keydown', function (e) {
            handleKeyboard(event, $(this), options);
        });

        if (!options.allowToggle) {
            // Get the first expanded/ active accordion
            var $expanded = $accordion.find('[aria-expanded="true"]').first();

            // If an expanded/ active accordion is found, disable
            if ($expanded.length) {
                $expanded.setAttribute(states.disabled.attr_name, states.disabled.attr_values.yes);
            }
        } else {
            // Get all unexpanded accordion panels
            var $unexpanded = $accordion.find('[aria-expanded="false"]');
            $unexpanded.each(function () {
                var panelId = $(this).attr('aria-controls');
                hidePanel ($(panelId))
            })
        }
    }

    function trigger ($trigger, $accordion, options) {
        var settings = {
            allowsMultiple: options.allowsMultiple,
            allowToggle   : options.allowToggle
        };

        var $targetPanel = $($trigger.attr(data.target_id));

        var isExpanded = $trigger.is("[" + states.expanded.attr_name + "='" + states.expanded.attr_values.yes + "']");
        var $accordionActiveTriggers = $accordion.find("[" + states.expanded.attr_name + "='" + states.expanded.attr_values.yes + "']");
        var $accordionActivePanels = $accordion.find(selectors.panel);

        if (!settings.allowsMultiple && $accordionActiveTriggers.length > 0) {
            // Set the expanded state on the triggering element
            $accordionActiveTriggers.not($trigger).attr(states.expanded.attr_name, states.expanded.attr_values.no);
            // Hide the accordion sections, using aria-controls to specify the desired section
            hidePanel($accordionActivePanels.not($targetPanel));

            // When toggling is not allowed, clean up disabled state
            if (!settings.allowToggle) {
                $accordionActiveTriggers.removeAttr(states.disabled.attr_name);
            }
        }

        if (!isExpanded) {
            // Set the expanded state on the triggering element
            $trigger.attr(states.expanded.attr_name, states.expanded.attr_values.yes);
            // Hide the accordion sections, using aria-controls to specify the desired section
            reveilPanel($targetPanel);

            // If toggling is not allowed, set disabled state on trigger
            if (!settings.allowToggle) {
                $trigger.attr(states.disabled.attr_name, states.disabled.attr_values.yes);
            }
        }
        else if (settings.allowToggle && isExpanded) {
            // Set the expanded state on the triggering element
            $trigger.attr(states.expanded.attr_name, states.expanded.attr_values.no);
            // Hide the accordion sections, using aria-controls to specify the desired section
            hidePanel($targetPanel);
        }
    }

    function reveilPanel ($panel) {
        $panel.slideDown();// .removeClass('hide');
    }

    function hidePanel ($panel) {
        $panel.slideUp(); //.addClass('hide');
    }

    function handleKeyboard (event, $accordion, options) {}
})();

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

    $('[data-video-close]').on('click', function() {
        try {
            self.players[self.lastVideoPlay].player.pauseVideo();
        } catch(err){
            console.log(err)
        }
    })

///// video youtube //////

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
