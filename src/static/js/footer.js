jQuery( document ).ready(function($) {
  var wrap = $("#accordion");
  var isFixed = false;
  var isDesktop = function(){
      //return jQuery(window).width() > 839;
      return jQuery(".st_header_v1").is(":visible");
    }

    var isMobile = function(){
        //return jQuery(window).width() <= 839;
        return jQuery(".st_header").is(":visible");
    }

    var isStoreMobile = function(){
      return jQuery("body").hasClass("mobile");
    }

  sroll_fixed();

  var $animation_elements = $('.animation-element');
  var $window = $(window);
  $('.mobile').find('.nav-item.lv-1').each(function(){
    $(this).addClass('align-items-center d-flex');
    $(this).find('.nav-link.lv-1').addClass('w-100');
    //$(this).height($('.mobile').find('.first-nav').height()/$('.mobile').find('.nav-item.lv-1').length)
    
    var secondNavHeight = $(this).find('.second-nav').height();
    var secondNavIndex = $(this).find('.nav-item-sub').length;
    $(this).find('.second-nav .nav-item-sub ').each(function(){
      $(this).addClass('align-items-center d-flex');
      $(this).find('.nav-link-sub ').addClass('w-100');
      $(this).css('height',100/secondNavIndex+'%');
    });
    $('.navbarText_3 .second-nav .nav-item-sub').css('height','20%'); 
	$('.navbarText_3 .second-nav').removeClass('justify-content-around');

    $(this).click(function(){
        $('.mobile').find('.nav-item.lv-1').css('background','transparent');
        $('.mobile').find('.nav-link.lv-1').css('color','#666');
        $(this).css('background','#eee');
        $(this).find('.nav-link.lv-1').css('color','#ff0217!important');
    });
  })


  function check_if_in_view() {
    var window_height = window.innerHeight;
    var window_top_position = $window.scrollTop();
    var window_bottom_position = (window_top_position + window_height);
   

    $.each($animation_elements, function() {
      var $element = $(this);
      var element_height = $element.outerHeight();
      var element_top_position = $element.offset().top;
      var element_bottom_position = (element_top_position + element_height);
      // console.log('element_top_position');
      // console.log(element_top_position);
      // console.log('window_bottom_position');
      // console.log(window_bottom_position);
      // console.log('element_bottom_position');
      // console.log(element_bottom_position);
   
      //check to see if this current container is within viewport
      if (
          (element_top_position <= window_bottom_position)) {
        $element.addClass('in-view');
        $element.addClass('animated');
        $element.addClass($element.data('animate'));
      } else {
        $element.removeClass('in-view');
        $element.removeClass('animated');
        $element.removeClass($element.data('animate'));
      }
    });
  }
  
/*
  function replaceBlankImgList(replaceList) {
    
    for (var i=0; i<replaceList.length; i++) {
      if(replaceList[i].getAttribute('data-src')) {
        replaceList[i].setAttribute('src',replaceList[i].getAttribute('data-src'));
      } 
    } 
  }

  var initStoreListImage = function(){

    var replaceList = jQuery(".store_location_img").filter("[id]");
    replaceBlankImgList(replaceList);

  };
*/

  $( window ).on("scroll", function(e) {
    /*if($( window ).scrollTop() > $('header').height()){
    		$("#accordion").addClass('accordion-fixed');
    		$(".collapse-leftmenu").addClass('collapse-fixed');
    		$(".collapse-leftmenu").css('top',$("#accordion h5").outerHeight()+'px');
    }else{
  		$("#accordion").removeClass('accordion-fixed');
    		$(".collapse-leftmenu").removeClass('collapse-fixed');
    		$(".collapse-leftmenu").css('top','0');
    }*/
    sroll_fixed();
    check_if_in_view();

  });
  $( window ).trigger('scroll');

  
  $(".mobile #email_crisis").find(".ec_close_container").on("click",function(){
    var $mobileHeader  = $('#st-site-header').find(".mobile");
    $('body').css({"padding-top":$mobileHeader.height()});
  })

  function sroll_fixed(){

    if (isStoreMobile()){
      return;
    }

    var $mobileHeader  = $('#st-site-header').find(".mobile");
    
    if( isDesktop() ) {
     if (scrollPoint($('.st_header_v1').height() - 19) == true){
        $('header').addClass('scroll_fixed');
        //$('.desktop_n_sf').addClass('hidden');
        $('.desktop_sf').removeClass('hidden');
        $('.desktop_sf').removeClass('fo');
        $('.desktop_sf').addClass('fi');
        $(".lock>a>img").attr("src", "/IMG_V4/homepage_asset/shopping-bag-white.png");

        //$('body').css('margin-top',$('.st_header').height());
      }else{
        $('header').removeClass('scroll_fixed');
        //$('.desktop_n_sf').removeClass('hidden');
        $('.desktop_sf').removeClass('fi');
        $('.desktop_sf').addClass('fo');
        $('.desktop_sf').addClass('hidden');
        $(".lock>a>img").attr("src", "/IMG_V4/homepage_asset/shopping-bag-red.png");
         //$('body').css('margin-top','0');
      }
    }
    if( isMobile()){
       $mobileHeader.css({"position":"fixed"});
        $('body').css({"padding-top":$mobileHeader.height()});
    } else {
      $mobileHeader.css({"position":"relative"});
      $('body').css({"padding-top":0});
    }
    /*if(scrollPoint($('.st_header').height()) == true){
      $('header').addClass('scroll_fixed');
      $(".lock>a>img").attr("src", "/IMG_V4/homepage_asset/shopping-bag-white.png");

      $('#back-to-top').fadeIn();
      //$('body').css('margin-top',$('.st_header').height());
    }else{
      $('#back-to-top').fadeOut();
      $('header').removeClass('scroll_fixed');
      $(".lock>a>img").attr("src", "/IMG_V4/homepage_asset/shopping-bag-red.png");
       //$('body').css('margin-top','0');
    }*/
    if($('#roaming-video-background').length > 0){
      var $elem = $('.gadgets-carousel');
      var $videoSection = $('#roaming-search-section');
      if( (scrollPoint($elem.offset().top)) && !(scrollPoint($videoSection.offset().top+$videoSection.outerHeight())) ){
        document.getElementById("roaming-video-background").play(); 
      }else{
        document.getElementById("roaming-video-background").pause(); 
      }
    }
  }
  function scrollPoint(y){
    if($( window ).scrollTop() > y){
      return true;
    }else{
      return false;
    }
  }

  function desktopSearch(){
    $('.st_lv1_nav').removeClass('show');
    $('.mobile-menu-btn').css({
      position: 'static',
      right: '0px',
      top: '0px',
      zIndex: '18',
      color: 'inherit'
    });
    $('#main-nav').css({width:'auto'});
    $('.mobile-menu-btn').find('.fa').addClass('fa-bars');
    $('.mobile-menu-btn').find('.fa').removeClass('fa-times');
    $('#user-login').prependTo($('#user-login-container'));
    $('#live-chat').prependTo($('#live-chat-container'));
    $('#business-site').prependTo($('#business-site-container'));
    $('#contact-us').prependTo($('#contact-us-container'));
    $('#language-btn').prependTo($('#language-btn-container'));
    $('#search').prependTo('#search-container');
    $('#search').find('.search-input').removeClass('show');
    //$('#search').find('.search-input').css({width:'0px',display:'none',borderWidth:'1px'});
    $('#search').find('.search-btn').css('marginLeft','0px');
    $('#search').find('.search-btn').css('marginRight','-50px');
    $('#search').find('.search-btn').appendTo('#search');
    $('#mobile-search').remove();
    $('#mobile-nav-header').remove();
    $('#mobile-nav-footer').remove();
  }
  $(window).resize(function(){
    if (window.matchMedia('(max-width: 839px)').matches)
    {
      jQuery('.gadgets-carousel').find('.card').each(function(){
        jQuery(this).addClass('active');
      });
    }else{
      jQuery('.gadgets-carousel').find('.card').each(function(){
        jQuery(this).removeClass('active');
      });
      sroll_fixed();
    }
    $('.section-card-gridsss').each(function(){
      var mobileItemsOnView = 1;
      var desktopItemsOnView = 2;
      var ItemsOnView;

      if (window.matchMedia('(max-width: 767px)').matches)
      {
        ItemsOnView = mobileItemsOnView;
      }else{
        ItemsOnView = desktopItemsOnView;
      }

      //var animateProcess = false;
      var container = $(this).find('.section-card-grid-container');
      nthOfChind = container.children().length;

      var itemWidth = container.children().first().outerWidth()+parseInt(container.children().first().css('marginLeft'))+parseInt(container.children().first().css('marginRight'));
      
      //var marginLeftValue = ItemsOnView*(container.data('nth') -1);

      container.width(
        container.children().length*itemWidth+'px'
      );
      container.data('nth',2);
      // console.log(container.data('nth'));
      container.css('marginLeft','-'+itemWidth*(ItemsOnView +0.7)+'px');
     /* if(container.data('nth') == 0){
        container.css('marginLeft','-' + 0);
      }else if (container.data('nth') == Math.round(nthOfChind/ItemsOnView)){
          container.css('marginLeft','-' + ( itemWidth*(ItemsOnView + 0.7) + itemWidth*ItemsOnView*(container.data('nth')-2)  - itemWidth*0.7 ) );
      }else{
        container.css('marginLeft','-' + ( itemWidth*(ItemsOnView + 0.7) + itemWidth*ItemsOnView*(container.data('nth')-2) ) );
      }*/
    });
  });

  $('.btn-home-go-down').click(function(){
    //$( window ).scrollTop($('#main-slider').outerHeight()+$('header').outerHeight()-150);
    $("html, body").animate({scrollTop:$('#main-slider').outerHeight()+$('header').outerHeight()-150}, 500, 'swing', function() { 
    });
  });

  $('#back-to-top').click(function(){
    $("html, body").animate({scrollTop:0},500);
  });
  /* live chat top menu*/
        jQuery('#live-person-icon-topmenu').click(function() {
          jQuery('#menu-close').trigger("click");
           TriggerOpenedChatOptions();
  });
        /* live chat top menu*/
/*  jQuery( ".hover_shadow" )each(function(){
    jQuery( this ).hover(
        function() {
            jQuery( this ).css({
                'transform':'translate(-3px, -3px)',
                'transition-duration': '0.3s'
            });
        },function() {
          jQuery( this ).css({'transform':'translate(0)'});
        }
    );
  });*/
});


function replaceBlankImgList(replaceList) {
  
  for (var i=0; i<replaceList.length; i++) {
    if(replaceList[i].getAttribute('data-src')) {
      replaceList[i].setAttribute('src',replaceList[i].getAttribute('data-src'));
    } 
  } 
}

var initStoreListImage = function(){

  var replaceList = jQuery(".store_location_img").filter("[id]");
  replaceBlankImgList(replaceList);

};

