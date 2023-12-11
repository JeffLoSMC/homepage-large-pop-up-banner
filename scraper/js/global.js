function SubmitSearchFormV4(fieldId) {
	$(fieldId).value = $(fieldId).value.trim();
	if ($(fieldId).value == "") return false;

	// +++++
	// Keyword Mapping
	var sLowerQuery = $(fieldId).value.toLowerCase();
	for (var iID in sKeywordMap) {
		if (sLowerQuery == sKeywordMap[iID][0]) {
			$(fieldId).value = sKeywordMap[iID][1];
			break;
		}
	}
	
	// +++++
	return true;
}
function GetHrefWithDomain(href){
	var $a = jQuery("<a></a>");
	$a.attr("href", href);
	var $body = jQuery("body");
	$body.append($a);
	var value = $a[0].href;
	$a.remove();
	return value;
}
// return true if success
// return false if cant
// if caller is a click event listener, should preventDefault() only if return true
function OpenInAppBrowser(href){
	if(typeof(redso) == "undefined"){
		console.log("redso undefined");
		return false;
	}
	try{
		redso.mobileApp('open_in_app_browser', {"url": GetHrefWithDomain(href)});
		return true;
	}catch(err){
		console.log(err);
	}
	return false;
}
function IsStFrontdesk(){
	return jQuery("style[data-id='style-for-stfrontdesk']").length > 0;
}
function InitAnchorTargetForStFrontdesk(){
	if(!IsStFrontdesk()){
		return;
	}
	//
	var changeAllToBlank = function($list){
		$list.not("[target='_blank']").each(function(){
			var $this = jQuery(this);
			
			//console.log("anchor "+$this.attr("href") + " " + $this.attr("target"));
			$this.attr("target", "_blank");
			//console.log("anchor "+$this.attr("href") + " " + $this.attr("target"));
			
		});
	};
	var chanegOpenWithExternal = function($a){
		var $ext = $a.filter("[data-open-with='external']");
		changeAllToBlank($ext);
	};
	var changePdf = function($a){
		var $pdf = $a.filter("[href$='.pdf']");
		//console.log("anchor $pdf = " + $pdf.length);
		changeAllToBlank($pdf);
	};
	var changeNonSelf = function($a){
		var $withTarget = $a.filter("[target]").not("[target='']");
		var $nonSelf = $withTarget.not("[target='_self']");
		//console.log("anchor $nonSelf = " + $nonSelf.length);
		changeAllToBlank($nonSelf);
	};
	var changeNonSmartone = function($a){
		$a.each(function(){
			var hostname = this.hostname.toLowerCase();
			if(hostname != ""){
				if(!hostname.endsWith("smartone.com")){
					//console.log("anchor " + hostname);
					changeAllToBlank(jQuery(this));
				}	
			}
		});
		
	};
	//
	//console.log("anchor 0 initAnchorTargetForStFrontdesk");
	var $a = jQuery("a").not("[target='_blank']");

	try{
		//console.log("anchor 1 " + $a.length);
		chanegOpenWithExternal($a);
		$a = $a.not("[target='_blank']");
		//console.log("anchor 2 " + $a.length);
		changePdf($a);
		$a = $a.not("[target='_blank']");
		//console.log("anchor 3 " + $a.length);
		changeNonSelf($a);
		$a = $a.not("[target='_blank']");
		//console.log("anchor 4 " + $a.length);
		changeNonSmartone($a);
		$a = $a.not("[target='_blank']");
		//console.log("anchor 5 " + $a.length);
	}catch(err){
		console.log(err);
	}
}
function TriggerContentRendered(){
	jQuery("html").trigger("smt_content_rendered");
};
function OnContentRendered(){
	InitAnchorTargetForStFrontdesk();
}
function is_touch_device() {
  return 'ontouchstart' in window        // works on most browsers 
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};
jQuery( document ).ready(function($) {
	document.addEventListener('touchmove', function(e) {
		if($('#main-nav').hasClass('show')){
		 //e.preventDefault();
	 }else{
		 return true;
	 }
   }, {passive: false});
	jQuery('body').bind(
	  'touchmove',
	   function(e) {
	   	if(jQuery('#main-nav').hasClass('show')){
	    	//e.preventDefault();
	    }else{
	    	return true;
	    }
	  }
	);
	if (!!navigator.userAgent.match(/Trident\/7\./)) {
		//$.getScript('/JS_V4/vender/bluebird.min.js', function( data, textStatus, jqxhr ) {
		//	console.log('Promise added');
			jQuery('body').addClass('v4-ie');
			if (!String.prototype.includes) {
			  String.prototype.includes = function(search, start) {
			    'use strict';
			    if (typeof start !== 'number') {
			      start = 0;
			    }
			    
			    if (start + search.length > this.length) {
			      return false;
			    } else {
			      return this.indexOf(search, start) !== -1;
			    }
			  };
			}
		//});
	} else if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
		//iOS
		jQuery('body').addClass('v4-iphone');
		
		// Get the device pixel ratio
		var ratio = window.devicePixelRatio || 1;

		// Define the users device screen dimensions
		var screen = {
		width : window.screen.width * ratio,
		height : window.screen.height * ratio
		};

		// iPhone X Detection
		if (screen.width == 1125 && screen.height === 2436) {
			jQuery('body').addClass('v4-iphonex');
		}
	} else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
		//Firefox
		jQuery('body').addClass('v4-firefox');
	}
	// document.addEventListener('touchmove', function (event) {
	//   if (event.scale !== 1) { event.preventDefault(); }
	// }, false);
	$('.m-search-input').keypress(function(e) {
        if(e.which == 13) {
            window.location.href = "/en/search/?query="+$('.m-search-input').val();
        }
    });
	$('#main-nav').find('.hasCollapse').each(function(){
		$(this).click(function(){
			if (window.matchMedia('(max-width: 839px)').matches){
				$('#main-nav-cover').css('display','block');
				$(this).find('.navbar-collapse').css('display','block');
				$(this).parent().animate({
					right: '70%'
					}, 500, function() {
				});
				$(this).addClass('hasExpand');
			$(this).parent().find('.hasCollapse').find('.expand-icon').css('opacity','0');
			}
		});
	});
	$('#back-main-nav-icon').click(function(){
		$(this).parents('#main-nav').find('.hasExpand').find('.navbar-collapse').css('display','none');
		$(this).parents('#main-nav').find('.hasCollapse').parent().animate({
			right: '0%'
			}, 500, function() {
		});
		$(this).parents('#main-nav').find('.hasExpand').removeClass('hasExpand');
		$(this).parents('#main-nav').find('.hasCollapse').find('.expand-icon').css('opacity','1');
		$('#main-nav-cover').css('display','none');
	});

	//Defer image load
	$('img[src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="][data-src]:not([data-src=""])').each(function(){
		$(this).attr('src', $(this).data('src'));
	});
	var sDeferImageCSSClassIndex = 0, sDeferImageCSSContent = '';
	$('[data-bgimg]:not([data-bgimg=""])').each(function(){
		var targetTag = $(this);
		if (targetTag.data('bgmimg')) {
			sDeferImageCSSClassIndex = sDeferImageCSSClassIndex + 1;
			var sBGImg = targetTag.data('bgimg');
			var sBGMobImg = targetTag.data('bgmimg');
			var sBGMobBreakPoint = targetTag.data('bgmbreakpoint');
			var sBGCSSClass = "defer-image-" + sDeferImageCSSClassIndex

			sDeferImageCSSContent += "." + sBGCSSClass + "{background-image: url(" + sBGImg + ") !important;} ";
			sDeferImageCSSContent += "@media (max-width: " + sBGMobBreakPoint + "px) { ." + sBGCSSClass + "{background-image: url(" + sBGMobImg + ") !important;} } ";
			targetTag.addClass(sBGCSSClass);
		} else {
			targetTag.css("background-image", "url('" + targetTag.data('bgimg') + "')");
		}
	});
	if (sDeferImageCSSContent != "") {
		$("<style>").text(sDeferImageCSSContent).appendTo('head');
	}

	// $('.mobile-menu-btn').click(function() {
	// 	if (window.matchMedia('(max-width: 839px)').matches){
	// 		var target = $('#main-nav');
	// 		if(target.hasClass('show')){
	// 			$('body').css('overflow-y','auto');
	// 			target.animate({
	// 				opacity: '0',
	// 				}, 300, function() {
	// 				$(this).css('left','100%');
	// 				$(this).css('opacity','0');
	// 				$(this).removeClass('show');
	// 			});
	// 			$('.mobile-menu-btn').css({
	// 				position: 'static',
	// 				right: '0px',
	// 				top: '0px',
	// 				zIndex: '18',
	// 				color: 'inherit'
	// 			});
	// 		}else{
	// 			//mobileSearch(target);
	// 			target.css('left','100%');
	// 			//target.show();
	// 			if (window.matchMedia('(max-width: 766px)').matches){
	// 				$('body').css('overflow-y','hidden');
	// 				target.css('width','100%');
	// 				target.css('left','0%');
	// 				target.css('opacity','0');
	// 				target.addClass('show');
	// 				target.animate({
	// 					opacity: '1'
	// 					}, 300, function() {
	// 					$('.mobile-menu-btn').css({
	// 						position: 'static',
	// 						right: '0px',
	// 						top: '15px',
	// 						zIndex: '18'
	// 					});
	// 				});
	// 			}else if (window.matchMedia('(max-width: 839px)').matches){
	// 				$('body').css('overflow-y','hidden');
	// 				target.css('width','50%');
	// 				target.css('left','50%');
	// 				target.css('opacity','0');
	// 				target.addClass('show');
	// 				target.animate({
	// 					opacity: '1'
	// 					}, 300, function() {
	// 					$('.mobile-menu-btn').css({
	// 						position: 'static',
	// 						right: '0px',
	// 						top: '15px',
	// 						zIndex: '18'
	// 					});
	// 				});
	// 			}else{
	// 				target.css('width','auto');
	// 			}
	// 		}
	// 	}
	// });
	$('.mobile-menu-btn').click(function() {
			var target = $('#main-nav');
			var header = $('header');
			if(target.hasClass('show')){
				$(this).removeClass('clicked');
				$('header').find('.mobile').removeClass('nav-open');
				target.removeClass('show');
				document.addEventListener('scroll', function (event) {
				 return true;
				}, false);
				//header.removeClass('mobile-menu-show');
			}else{
				$(this).addClass('clicked');
				target.addClass('show');
				$('header').find('.mobile').addClass('nav-open');
				document.addEventListener('scroll', function (event) {
				 event.preventDefault();
				}, false);
				//header.addClass('mobile-menu-show');
			}
	});
	
	if(is_touch_device()){
		var $navItem = $('.st_lv1_nav').find('.nav-item');
		jQuery("body").on("touchstart", function(){
			$navItem.removeClass('hover');
		});
		$navItem.on("touchstart", function(event){
		    event.stopPropagation();
		});
		$navItem.each(function(){
			var $this = jQuery(this);
			var $link = $this.find(".nav-link");

			$link.on("click", function(e){
				var $parentNavItem = jQuery(this).closest(".nav-item");
				$navItem.not($parentNavItem).removeClass('hover');
				var hasCollapse = $parentNavItem.hasClass("hasCollapse");
				var hasHover    = $parentNavItem.hasClass("hover");
				if(hasCollapse && hasHover){

				}else if(hasCollapse){
					e.preventDefault();
					$parentNavItem.addClass('hover');
				}else{
				}
			});

		});
	}
	
	$('.st_lv1_nav').find('.nav-item').each(function(){
		if (window.matchMedia('(max-width: 766px)').matches){
			$(this).click(function(){
				$(this).addClass('hover');
			});
		}
	});
//search bar	

	$('.collapsed').each(function(){
		$(this).click(function() {
			if($('#' + $(this).data('toggle')).hasClass('show')){
				leftmenuMargin = '-180px';
				rightcontentMargin = '0';
				$('#' + $(this).data('toggle')).removeClass('show');
				$('#' + $(this).data('toggle')).animate({
					marginLeft: leftmenuMargin
				}, 300, function() {
					$('#' + $(this).data('toggle')).css('display','none');
				});
			}else{
				leftmenuMargin = '0';
				rightcontentMargin = '180px';
				$('#' + $(this).data('toggle')).addClass('show');
				$('#' + $(this).data('toggle')).css('display','block');
				$('#' + $(this).data('toggle')).animate({
					marginLeft: leftmenuMargin
				}, 300, function() {
				});
			}
			$('.rightcontent').animate({
				marginLeft: rightcontentMargin
			}, 300, function() {
			});
		});
	});

	$('.section-card-grid').each(function(){
		//click card item
		$(this).find('.swiper-slide').each(function(){
			$(this).click(function(){
				$(this).siblings('.swiper-slide').find('.card').removeClass('active');
				$(this).find('.card').addClass('active');
			});
		});
	});

	$('.style-b').find('.section-icon-grid-item').each(function(){
		$(this).click(function(){
			$(this).siblings('.section-icon-grid-item').removeClass('active');
			$(this).addClass('active');
			$(this).siblings('.section-icon-grid-item').find('.grid-icon-m').removeClass('active');
			$(this).find('.grid-icon-m').addClass('active');
		});
	});
	$('.section-planscard-grid').find('.planscard-grid-item-container').each(function(){
		$(this).click(function(){
			$(this).siblings('.planscard-grid-item-container').find('.planscard-grid-item').removeClass('active');
			$(this).find('.planscard-grid-item').addClass('active');
		});
	});
	$('.section-phone-grid').each(function(){
		$(this).find('.phone-grid-item-container').each(function(){
			$(this).click(function(){
				$(this).siblings('.phone-grid-item-container').find('.phone-grid-item').removeClass('active');
				$(this).find('.phone-grid-item').addClass('active');
			});
		});
	})
	// create a simple instance
	// by default, it only adds horizontal recognizers
	
	InitAnchorTargetForStFrontdesk();
	jQuery("html").on("smt_content_rendered", OnContentRendered);


	jQuery('.mobile-menu-btn').click(function() {
		jQuery('body').toggleClass('body-scrollabe--off');	
		jQuery('#navbarText').toggleClass('second-nav-scrollable--on'); 
	});

	jQuery('div#phone_and_plans').click(function() {
			jQuery('#main-nav>.first-nav>#has_more').addClass('has_more');
  	jQuery('div.hasExpand>#navbarText').on('scroll', function() {
    	var scrollTop = jQuery(this).scrollTop();
    	if(jQuery('div.hasExpand>#navbarText>.second-nav.flex-column.justify-content-around').height() - jQuery('div.hasExpand>#navbarText').height() - scrollTop < 40) {
			jQuery('#main-nav>.first-nav>#has_more').removeClass('has_more');
		}
		if(scrollTop == 0) {
			jQuery('#main-nav>.first-nav>#has_more').addClass('has_more');
		}
	});
	});
	jQuery('#back-main-nav-icon').click(function() {
		jQuery('#main-nav>.first-nav>#has_more').removeClass('has_more');
	});	
});
