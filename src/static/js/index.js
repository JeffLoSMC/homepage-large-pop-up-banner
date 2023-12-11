jQuery('body').on({
    'touchmove': function(e) { 
        //console.log(jQuery(this).scrollTop()); // Replace this with your code.
		
		/*if(jQuery(window).scrollTop() <= 0) {
			jQuery(".index-main-video_arrow").show();
		} else {
			jQuery(".index-main-video_arrow").hide();
		}*/
		
    }
});
jQuery( window ).on("scroll", function(e) {
	if(!isElementInViewport(jQuery('#main_footer_container'))) {
		jQuery(".index-main-video_arrow").fadeIn();
    } else {
        jQuery(".index-main-video_arrow").fadeOut();
    }
});
function isElementInViewport(el) {
	var rect = el[0].getBoundingClientRect();
	return (
	  rect.bottom <= (window.innerHeight+el.height() || document.documentElement.clientHeight+el.height()) /*or $(window).height() */
	);
}

jQuery(document).ready(function(){
	new ScrollHint('.js-scrollable',{
		i18n: {
			scrollable: ''
		},
		enableOverflowScrolling:false
	});
	var initBusinessDigitalizationConnectivity = function(){
		//
		var init = function($wrapper){
			$wrapper.find(".index-business_digitalization_tab-content--active").each(function(){
				jQuery(this).find(".index-business_digitalization__navbutton-wrapper").matchHeight();
			});
			//
			$wrapper.find("[data-controlled-element='index-business_digitalization-box']").mouseover(function(){
				var $this = jQuery(this);
				var index=jQuery("[data-controlled-element='index-business_digitalization-box']").index(this);
				$wrapper.find("[data-controlled-element='index-business_digitalization-box']").removeClass("index-business_digitalization_tab--hover");
				$this.addClass("index-business_digitalization_tab--hover");
			})
			.mouseout(function(){
				jQuery(this).removeClass("index-business_digitalization_tab--hover");
			});
			//
			$wrapper.find("[data-controlled-element='index-business_digitalization-box']").on("click touchend",function(){
				var $this = jQuery(this);
				//console.log(jQuery("[data-controlled-element='index-business_digitalization-box']").index(this));
				var index=$wrapper.find("[data-controlled-element='index-business_digitalization-box']").index(this);
				
				//console.log(index);
				$wrapper.find("[data-controlled-element='index-business_digitalization-box']").removeClass("index-business_digitalization_tab--active");
				$this.addClass("index-business_digitalization_tab--active");
				$this.find(".index-business_digitalization_tab-content").removeClass("index-business_digitalization_tab-content--active");
				var $activeContent = $wrapper.find(".index-business_digitalization_tab-content").eq(index);
				$activeContent.addClass("index-business_digitalization_tab-content--active");
				$wrapper.find(".index-business_digitalization_tab-content").hide();
				$activeContent.fadeIn();
				$activeContent.find(".index-business_digitalization__navbutton-wrapper").matchHeight({remove: true});
				$activeContent.find(".index-business_digitalization__navbutton-wrapper").matchHeight();
			});
		};
		//
		jQuery(".index-business_digitalization").each(function(){
			init(jQuery(this));
		});
	};
	//
	initBusinessDigitalizationConnectivity();
	
	//
	var swiper_main_video = new Swiper('#swiper-container_main-video', {
	  slidesPerView: 1,
	  spaceBetween: 0,
	  grabCursor: true,
	  loop: true,
	  autoHeight: true,
	  autoplay: {
		delay: 5000,
	  },
	  speed: 800,
	  autoplayDisableOnInteraction: false,
	  effect: 'fade',
	});
	//
	var swiper = new Swiper('#swiper-container_overlay_img', {
	  slidesPerView: 6,
	  spaceBetween: 20,
	  noSwiping: false,
	  allowSwipeToNext: false, 
	  allowSwipeToPrev: false,
	  simulateTouch : false,
	  loop:false,
	  initialSlide : 0,

	  breakpoints: {
		// when window width is <= 1100px
		1100: {
		  slidesPerView: 6,
		  centeredSlides: true,
		  spaceBetween: 20,
		  grabCursor: true,
		  allowSwipeToNext: true, 
		  allowSwipeToPrev: true,
		  width:1360,
		  pagination: {
			el: '#index-industry_applications_image-swiper-pagination',
			clickable: true,
		  },
		}
	  }
	});
	swiper.on('slideChange', function () {
	  //console.log('slide changed');
	  jQuery(".scroll-hint-icon-wrap").removeClass("is-active");
	});
	//
	var swiper_video = new Swiper('#swiper-container_video', {
	  /*slidesPerView: 5,*/
	  slidesPerView: 1,
	  grabCursor: true,
	  loop: true,
	  breakpointsInverse: true,
	  breakpoints: {
		// when window width is >= 921px
		921: {
		  centeredSlides: true,
		  spaceBetween: 20,
		  grabCursor: true,
		  slideToClickedSlide: true,
		  /*loopedSlides: 4, */
		  slidesPerView: 2,
		  shortSwipes:true,
		  preventClicksPropagation: false,
		  preventClicks: false
		},
		1861: {
		  centeredSlides: true,
		  spaceBetween: 20,
		  grabCursor: true,
		  slideToClickedSlide: true,
		  /*loopedSlides: 4, */
		  slidesPerView: 3,
		  shortSwipes:true,
		  preventClicksPropagation: false,
		  preventClicks: false
		},
		2817: {
		  centeredSlides: true,
		  spaceBetween: 20,
		  grabCursor: true,
		  slideToClickedSlide: true,
		  /*loopedSlides: 4, */
		  slidesPerView: 4,
		  shortSwipes:true,
		  preventClicksPropagation: false,
		  preventClicks: false
		}
	  }
	});
	swiper_video.on('slideChangeTransitionEnd', function () {
		//console.log(swiper_video.activeIndex);
		//console.log(swiper_video.realIndex);
		//var currentIndex=swiper_video.activeIndex%4;
		var currentIndex=swiper_video.realIndex;
		//console.log("currentIndex="+currentIndex);
		jQuery("[data-controlled-element='index-video_highlights_small_img-box']").removeClass("index-video_highlights_small_img-item--active");
		jQuery(".index-video_highlights_small_img [data-controlled-element='index-video_highlights_small_img-box']").eq(currentIndex).addClass("index-video_highlights_small_img-item--active");
		/*
		if(jQuery( window ).width()<=920) {
			jQuery(".index-video_highlights_small_img [data-controlled-element='index-video_highlights_small_img-box']").eq(currentIndex-1).addClass("index-video_highlights_small_img-item--active");
		} else {
			jQuery(".index-video_highlights_small_img [data-controlled-element='index-video_highlights_small_img-box']").eq(currentIndex-2).addClass("index-video_highlights_small_img-item--active");
		}*/
		jQuery(".index-video_highlights_video .inline-video__opening [data-controlled-element='index-video_opening_overlay']").removeClass("index-video_opening_overlay--active");
		jQuery(".index-video_highlights_video .index-video_highlights_video-item.swiper-slide-active [data-controlled-element='index-video_opening_overlay']").addClass("index-video_opening_overlay--active");
	});
	swiper_video.on('slideChangeTransitionStart', function () {
		for(var i=0;i<jQuery("video").length;i++) {
			jQuery("video").get(i).pause();
		}		
	});
	
	var initVideoHighlights = function(){
		//
		var init = function(){
			jQuery(".index-video_highlights_video--mobile_text div").hide();
			jQuery(".index-video_highlights_video--mobile_text div").eq(0).show();
			jQuery("[data-controlled-element='index-video_highlights_small_img-box']").click(function(){
				var index=jQuery("[data-controlled-element='index-video_highlights_small_img-box']").index(this);
				//console.log(index);
				jQuery("[data-controlled-element='index-video_highlights_small_img-box']").removeClass("index-video_highlights_small_img-item--active");
				jQuery(this).addClass("index-video_highlights_small_img-item--active");
				swiper_video.slideToLoop(index);
				/*
				if(jQuery( window ).width()<=920) {
					swiper_video.slideTo(index+1);
				} else {
					swiper_video.slideTo(index+2);
				}*/
				jQuery(".index-video_highlights_video--mobile_text div").hide();
				jQuery(".index-video_highlights_video--mobile_text div").eq(index).show();
			});
		};
		
		//
		init();
	};
	//
	initVideoHighlights();
});