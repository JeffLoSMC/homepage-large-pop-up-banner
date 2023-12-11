// storeHeroBanner
(function($) {
 
    $.fn.storeHeroBanner = function() {

    	var animateSlide = function($slide){
    		$slide.find('.has-animation').each(function(idx,child){

				var el = $(child);
				
                var options = {
                    animation: el.data('animation'), 
                    duration: el.data('duration'),
                    keep: false
                };

                var initPos = el.data('initpos');

                if (initPos != "") {
                    el.attr('style',initPos);
                }


                var fxTiming = el.data('timing');
                if (fxTiming != "") {
                    options.timing = fxTiming;
                }

                var fxDelay = el.data('delay');
                if (fxDelay != "") {
                    options.delay = fxDelay;
                }

                var fxCallback = eval(el.data('callback'));

				try {
                    if (fxCallback != "") {
                        el.animo(options, fxCallback ) ;
                    } else {
                       el.animo(options);
                    }
				} catch (err) {}

	        });
    	};
		var getSlidesWrapper = function($container){
			return $container.find(".heroSlider");
		};
		var optString = function(value, defaultValue){
			return ((value || "") == "") ? defaultValue : value;
		};
		var initOverlayButton = function($container){
			$container.on('click','.banner-overlay-btn',function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				var el = $(this);
				var url = encodeURI( el.data('url') );
				location.href = url ;
			});
		};
    	var init = function($container){		
			//console.log("storeHeroBanner init...");
			$container.attr("data-start-init", "true");
			var setupCarousel = function($container, $slidesWrapper){

				$slidesWrapper.on('activeChanged.owl.carousel',function(event) {
					//console.log("activeChanged");
					var $slide = $slidesWrapper.find('.owl-item.active .st-banner-slide');
					//$('#heroBanner').css('background','none'); // remove Spinner after first loaded
					animateSlide($slide);
				});

				$slidesWrapper.on('initialized.owl.carousel',function(event) {
					//console.log("initialized")
					$container.css('background','none').css('height','auto'); /* remove Spinner after first loaded */
					$container.find('.st-banner-slide').css('opacity','1');
					$slidesWrapper.trigger('to.owl.carousel', [0,300]);
				});

				$slidesWrapper.owlCarousel({
					//lazyLoad:true,
					items:1,
					loop:true,
					navRewind:false,
					autoplay:true,
					autoplayTimeout:10000,
					autoplayHoverPause:true,
					smartSpeed:500
				});

				$container.find('.hero-prev-btn').on('click', function () {
					$slidesWrapper.trigger('prev.owl.carousel', [500]);
				});
				
				$container.find('.hero-next-btn').on('click', function () {
					$slidesWrapper.trigger('next.owl.carousel', [500]);
				});
			};			
			//
			var $slidesWrapper = getSlidesWrapper($container);
			var $slides = $slidesWrapper.children();
			//console.log("$slides.length="+$slides.length);
			if($slides.length > 1){
				setupCarousel($container, $slidesWrapper);
			}else{
				$container.find('.hero-prev-btn').remove();
				$container.find('.hero-next-btn').remove();
				$container.css('background','none').css('height','auto'); /* remove Spinner after first loaded */
				$container.find(".st-banner-slide").css('opacity','1');
				animateSlide($container.find(".st-banner-slide"));
			}
			initOverlayButton($container);
			//
		};
 
        return this.each(function(){
        	init(jQuery(this));
        });
    };
 
}(jQuery));

jQuery(document).ready(function($) {
	
	var $heroBanner = jQuery("[data-controlled-element='store-hero-banner']");
	if($heroBanner.length > 0){
		if($heroBanner.find(".heroSlider").hasClass("owl-carousel")){
			//console.log("already init owl-carousel");
		}else{
			//console.log("no init owl-carousel");
			if($heroBanner[0].hasAttribute("data-placement-r42")){
				//console.log("hero banner with relay 42");
				// check if init has been resumed, this could happen if this code run after relay 42 calls
				if($heroBanner.attr("data-resume-init") == "true"){
					if($heroBanner.attr("data-start-init") != "true"){
						$heroBanner.storeHeroBanner();
					}
				}else{
					$heroBanner.on("resume_init", function(){
						//console.log("resume_init");
						jQuery(this).storeHeroBanner();
					});
				}
			}else{
				//console.log("hero banner without relay 42");
				$heroBanner.storeHeroBanner();
			}
		}	
	}
	
	
	
	

	ordering.newsletter();
	//ordering.checkTimeout();
	
	$('[data-popover]').each(function(idx,child) {
		var param = {
			trigger: $(child).data('trigger') || 'click hover'
			,placement: $(child).data('placement') || 'auto'
			,delay: $(child).data('delay') || {show: 50, hide: 400}
		}
		//console.log('pop_attr?',$(child).data('trigger'),$(child).data('delay'),param,child);
		$(child).popover(param);
	});
	
	$('.tile-inner img[data-src!=""]').each(function(idx,child) {
		var $child = $(child);
		var thumb = $child.attr('data-src');
		if (thumb && thumb != '') {
		try {
			$child.parent().css('background-color','#fff');
			$child.hide();
			
			var img = new Image();
			img.src = thumb;
			// demo_ quick fix on image loading problem
			if (!img.complete) {
				$(img).on('load',function() {
					$child.parent().css('background-color','#fff');
					if ($child.is('div'))
						$child.css('background-image','url('+thumb+')');
					else 
						$child.attr('src',thumb);
					$child.fadeIn(700);
					$child.show();
					img = null;
				});
			} else {
				$child.attr('src',thumb);
				$child.fadeIn(700);
				$child.show();
			}
		} catch (err) {
		//console.log('err:',err);
			if ($child.is('div')) {
				$child.css('background-image','url('+thumb+')');
			} else 
				$child.attr('src',thumb);
			$child.parent().css('background-color','#fff');
			$child.fadeIn(700);
			$child.show();
		}
		}
	});

	/*
    try {
        $('.carousel').carousel('pause');
        $('.carousel-inner').each(function(item) {
            var first = $('.item:first-child',item);
            $(first).addClass('active');
        });
    } catch (err) {
       //console.log('carouse_err:',err);
    }
	*/
	
	$('#catNavToggle').click(function(){
			var el = $(this);
			el.toggleClass('opened');
			
			var menu = $('#catGlobalNav');
			
			//menu.toggleClass('opened');
			
			if (el.hasClass('opened')) {
				menu.removeClass('animated st-slideOutUp');
				menu.addClass('animated st-slideInDown');
			} else {
				menu.removeClass('animated st-slideInDown');
				menu.addClass('animated st-slideOutUp');
			}
	});

	$('#catGlobalNav a.st-cat-nav-group, #catGlobalNav .st-cat-nav-panel a').click(function() {
		if ($('#catNavToggle').is('.opened')) {
			$('#catNavToggle').click();
		}
	})
	
	
	if (bStoreMobilePhone) {
		/* Mobile Menu */
		var mobNavGa = function(){
			var $nav = jQuery("#mobNav");
			if($nav.length==0) {
				return;
			}
			var KEY = "data-ga-impression-call";
			if($nav.attr(KEY)=="done"){
				return;
			}
			//console.log("calling side GA...");
			ga_homemenu_impression('Side');
			$nav.attr(KEY, "done");
		};
		$('#mobNavToggle').on('click',function(evt){

			evt.preventDefault();
			evt.stopImmediatePropagation();
			evt.stopPropagation();

			var el = $(this);
			var root = $('#mobLogoPanel');
			var menu = $('#mobNavPanel');
			var doc = $('body');

			if (el.hasClass('opened')) {

				/* CLOSE MOB MENU*/
				el.removeClass('opened');
				root.removeClass('opened');
				doc.css('position','static');
				menu.fadeOut();
			} else {

				/* OPEN MOB MENU */
				el.addClass('opened');
				root.addClass('opened');
				doc.css('position','fixed');
				menu.fadeIn();
				mobNavGa();
			}

			
		});
		
		/*
		$('#mobNav').on('click','a',function(){
			var el = $(this);
			if (el.hasClass('selected')) return false;
			el.siblings().removeClass('selected');
			el.addClass('selected');

			var idx = jQuery("#mobNav").children("a").index(el);
			$('#mobNavCatList nav').removeClass('active');
			$('#mobNavCatList nav:eq('+idx+')').addClass('active');

		});
		*/
		

		$('#mobAccNavToggle').on('click',function(){
			var el = $(this);
			var nav = el.next(nav);

			if (el.hasClass('opened')) {
				/* Close the Nav */
				el.removeClass('opened');
				nav.slideUp();
			} else {
				var menu = $('#mobNavPanel .mobNavWrapper');
				/* Open the Nav */
				el.addClass('opened');
				nav.slideDown();
				menu.animate({ scrollTop: menu.prop("scrollHeight")}, 1000);
			}
			
			

		});
	
	
	}else{
		$('.color-choice.activated').on('click','span',function(e){ 
			var target = $(this); 
			var iHSID = target.attr('hsid'); 
			var colorID = target.attr('colorid'); 
			var type = target.attr('type'); 
			var img = target.closest('.tile-inner').find('figure img').first(); 
			
			img.attr('showingcolor', colorID); 
			
			
			var sImgList = target.attr('imgurl'); 
			var aryImgList = sImgList.split(",");
			
			if(aryImgList.length>1){
				img.attr('src', aryImgList[0]); 
			}else{
				img.attr('src', sImgList);
			}
			img.attr('hsid',iHSID);
			
			
			
			img.addClass('animated st-device-scale-increase'); 
			
			img.on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(){ 
			img.removeClass('animated st-device-scale-increase'); 
			
			}); 
			
			
		}); 
		
		/* Roll Over Effect */
		try {
		$('.thumbnail_rollover').each(function(idx,child) {
			var aryColor = $('.colorswatch[hsid=' + $(child).attr('hsid') + ']');
			// skip rollover effect when no color option at all
			if(aryColor.length==0) {
				return true; // break the each loop
			}			
			$(child).on('mouseover',function(evt) {
				var target = evt.target;
				var iShowingColor = $(target).attr('showingcolor');
				var aryColor = $('.colorswatch[hsid=' + $(target).attr('hsid') + ']');
				var sImgList = $(aryColor[iShowingColor]).attr('imgurl');
				var aryImgList = sImgList.split(",");
				
				if(aryImgList.length>1){
					$(target).fadeOut(400, 'swing', function() {
						$(target).attr('src',  aryImgList[1]);
						$(target).fadeIn(250, 'swing');
					});
					$(target).attr('showingSeq', 1);
					timerRollOver = setInterval(
						function() {
							$(target).fadeOut(400, 'swing', function() {
								var iNewSeq = parseInt($(target).attr('showingSeq')) + 1;
								iNewSeq = iNewSeq % aryImgList.length;
								$(target).attr('showingSeq', iNewSeq);
								$(target).attr('src', aryImgList[iNewSeq]);
								$(target).fadeIn(250, 'swing');
							});
						},
						3000
					);
				}
				
			});
			$(child).on('mouseout',function(evt) {
				if (timerRollOver != null) clearTimeout(timerRollOver);
				
				var target = evt.target;
				var iShowingColor = $(target).attr('showingcolor');
				var aryColor = $('.colorswatch[hsid=' + $(target).attr('hsid') + ']');
				var sImgList = $(aryColor[iShowingColor]).attr('imgurl');
				if (sImgList && sImgList != '') {
					var aryImgList = sImgList.split(",");
					
					
					$(target).fadeOut(400, 'swing', function() {
						$(target).attr('showingSeq', 0);
						$(target).attr('src', aryImgList[0]);
						$(target).fadeIn(250, 'swing');
					});
				}
			});
		});
		} catch (err) {
		//console.log('rollover_err:',err);
		}
	}

	$('.tabarrow-selector .tabarrow-tab').on('click','a',function(){
		var el = $(this);
		if (el.hasClass('selected') || el.hasClass('unClick')) return false;

		el.siblings().removeClass('selected');
		el.addClass('selected');

		var idx = el.index();

		var tabPanes = el.closest('.tabarrow-selector').find('.tabarrow-pane'); //$('#premium-panes .premium-tab-content');
	
		tabPanes.removeClass('active fadeIn animated');
		tabPanes.eq(idx).addClass('fadeIn animated active');
	});

	/*
	$( window ).unload(function() {
		deleteCookie("ecCok01", "/");
		deleteCookie("ecCok02", "/");
		deleteCookie("cart", "/");
		deleteCookie("cag_sid", "/");
		deleteCookie("loginid", "/");
		return;
	});
	*/

/**
 * Hide Element (for demo purpose) * 
 * 20160122
 * forceHide 
 */
 /*
	forceHide = true;
	if (forceHide) {
		$(".shop-list-name .shop__status").hide();
		$(".mobile .shop-detail .shop__status").hide();
	}
*/


	window.onload = function() {
		$('.swiper-container').each(function(idx,elm){
			var $element = $(elm);
			// bypass when find a container with "bypass-swiper-container" class
			if($element.closest(".bypass-swiper-container").length == 0){
				var mySwiper = new Swiper ($element, {
					// Optional parameters
					direction: 'horizontal',
					loop: false,
					onTouchEnd:function(swiper){
						try{
							var nextItem = swiper.slides[swiper.activeIndex+1];
							var simgURL = $(nextItem).find('img').attr('asrc');
							if(simgURL!=""){
								$(nextItem).find('img').attr('src',simgURL);
								$(nextItem).find('img').attr('asrc',"");
							}
						}catch(err){}
						
						// in case it is hidden during init
						$element.find(".swiper-slide").each(function(){
							var thisStyle = jQuery(this).attr("style").toLowerCase();
							if(thisStyle.indexOf("width")==-1){
								//console.log("style="+thisStyle);
								swiper.update();
							}							
						});
						//
					}
					,onInit:function(swiper){
						//console.log(swiper.slides.length);
						
						//console.log(swiper);
					}
				});
			}
		});	
	};

	// web chat
	$('.mobile .st-mob-hotlinks>a:first-child').before($('.mobile #st-web-chat-for-mobile-menu'));
	$('.mobile #st-web-chat-for-mobile-menu').show();

	//search bar
	/*jQuery(".topmenu__search-btn").on("click",function(){
		var $this = jQuery(this);		
		var $topBar = $this.closest(".topmenu__menu");
		var $topSearchBar = $topBar.next(".search-wrapper");

		$topBar.fadeOut(function(){$topSearchBar.animate({opacity: 1.0, right: '0'}, 500);
			$topSearchBar.find(".search-placeholder").delay(400).animate({opacity: 1.0}, 500);
			$topSearchBar.find(".search-close").delay(800).animate({opacity: 1.0}, 500);
		})
	});

	jQuery(".search-close").on("click",function(){
		var $this = jQuery(this);		
		var $topBar = $this.closest(".topmenu__menu");
		var $topSearchBar = $topBar.next(".search-wrapper");

		var searchBarWidth = - $topBar.parent().width();
		$topSearchBar.animate({opacity: 0, right: searchBarWidth}, 300, function() {
			$topSearchBar.find(".search-placeholder").css({opacity: 0}).val("");
			$topSearchBar.find(".search-close").css({opacity: 0});
	    	$topBar.fadeIn();
	  	});
	});*/

	var $header = jQuery('.st-header');
	var $searchBar = jQuery(".search-wrapper");

	jQuery(".topmenu__search-btn").on("click",function(){
		var $menuWrapper = jQuery(".top-menu-wrapper, .affix .bottom-menu-wrapper");
		$header.addClass("search-on");
		$menuWrapper.fadeOut(function(){$searchBar.animate({opacity: 1.0, right: '0'}, 500);
			$searchBar.find(".search-placeholder").delay(400).animate({opacity: 1.0}, 500);
			$searchBar.find(".search-close").delay(800).animate({opacity: 1.0}, 500);
		})
	});

	$searchBar.find(".search-close").on("click",function(){
		//var searchBarWidth = -$menuWrapper.parent().width();
		var $menuWrapper = jQuery(".top-menu-wrapper, .bottom-menu-wrapper");
		var searchBarWidth = -880;
		$header.removeClass("search-on");
		$searchBar.animate({opacity: 0, right: searchBarWidth}, 300, function() {
			$searchBar.find(".search-placeholder").css({opacity: 0}).val("");
			$searchBar.find(".search-close").css({opacity: 0});
	    	$menuWrapper.fadeIn();
	  	});	  	
  		/*$searchBar.css({opacity: 0, right: searchBarWidth});
  		$searchBar.find(".search-placeholder").css({opacity: 0}).val("");
		$searchBar.find(".search-close").css({opacity: 0});
  		$menuWrapper.fadeIn();*/
	  	
	});	

	jQuery(window).scroll(function(){
        if( ($header.hasClass("affix")) && ($header.hasClass("search-on")) ){
              jQuery(".bottom-menu-wrapper").hide();
        } else {
            jQuery(".bottom-menu-wrapper").show();
        }    
	});

})

function DateDisplay(sInputEngDate, sLanguage){
	// sInputEngDate : "12 April 2016 18:00:00"
	var tmpAry = sInputEngDate.split(" ");
	if(tmpAry.length > 3) {
		var secondAry = tmpAry[3].split(":");
		if (secondAry.length >= 3) {
			tmpAry[3] = secondAry[0] + ":" + secondAry[1];
			sInputEngDate = tmpAry[0] + " " + tmpAry[1] + " " + tmpAry[2] + " " + tmpAry[3];
		}
	}

	var sRtn = "";
	var sMonth_Chi = "";
	var sWeek_Chi = "";
            

    var arySMonthEng = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    var arySMonthChi = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    var arySWeekEng = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    var arySWeekChi = ["日", "一", "二", "三", "四", "五", "六"];
	
	if(sLanguage==="tc"){
		try{
			var arrEngDate = sInputEngDate.split(" ");
						
			if(arrEngDate.length >= 3){
				//english format: 19 Jan 2016 / 19 January 2016
							
				for(i=0; i<arySMonthEng.length; i++){
					if((arrEngDate[1].toLowerCase()).indexOf(arySMonthEng[i])>-1){
					   sMonth_Chi = arySMonthChi[i];
					   break;
					}
				}
							
				sRtn = arrEngDate[2] + "年"  + sMonth_Chi  + "月"  + arrEngDate[0] + "日";
							
				if(arrEngDate.length==4){
					//contain week eg: 19 Jan 2016 (Fri)
					if((arrEngDate[3].indexOf(":")>-1)){
						sRtn += arrEngDate[3];

					} else {			
						for(i=0; i<arySWeekEng.length; i++){
							if((arrEngDate[3].toLowerCase()).indexOf(arySWeekEng[i])>-1){
								sWeek_Chi = arySWeekChi[i];
								break;
							}
						}
						sRtn = sRtn + " (" + sWeek_Chi + ")";
					}
				}
							
			}else{
				sRtn = sInputEngDate;
			}
		}catch(err) {
			sRtn = sInputEngDate;
		}	
	}else{
		sRtn = sInputEngDate;
	}
         
    return sRtn;
}