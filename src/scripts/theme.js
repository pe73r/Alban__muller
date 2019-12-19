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

///footer__menu mobile

// $(document).ready(function() {
//   if ($(window).width() < 800) {
//       if ($('[data-footer-panel]').is(':visible')) {
//         $(".arrow-right").addClass("arrow-rotate");
//       }
//       $("[data-menu-trigger]").click(function() {
//           if ($('[data-footer-panel]').is(':visible')) {
//           $("[data-footer-panel]").slideUp(600);
//           $(".arrow-right").removeClass("arrow-rotate");
//         }
//
//         if($(this).next("[data-footer-panel]").is(':visible')) {
//           $("[data-footer-panel]").slideUp(300);
//           $(".arrow-right").removeClass("arrow-rotate");
//
//         }else {
//           $(this).next("[data-footer-panel]").slideDown(600);
//           $(".arrow-right").addClass("arrow-rotate");
//                }
//              });
//     }
//   });


  $("[data-toggle-container]").on('click', function(){
    if ($(window).width() < 800) {
        $(this).find("[data-toggle-content]").slideToggle();

        var arrow = $(this).find("[data-toggle-arrow]");
        if ($(arrow).hasClass('arrow-rotate')) {
            arrow.removeClass('arrow-rotate');
        }
        else {
            arrow.addClass('arrow-rotate');
        }
    }
})
