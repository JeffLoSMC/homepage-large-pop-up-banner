
var InlineVideo = {};
InlineVideo.init = function($video){
	var PLAY_TYPE = ["play", "playing"];
	var STOP_TYPE = ["pause", "ended"];

	var onchange = function(type){
		//console.log(type);
		if(PLAY_TYPE.indexOf(type) >= 0){
			setPlaying();
		}else if(STOP_TYPE.indexOf(type) >= 0){
			unsetPlaying();
		}
	};
	var promise = null;
	var pauseVideo = function(){
		$v[0].pause();
	};
	var removeOpening = function(){
		//$video.find("[data-role='inline-video-opening']").remove();
	};
	var playVideo = function(){
		promise = $v[0].play();
		if(promise){
			promise.then(function(){
				//console.log("then");
			}).catch(function(err){
				//console.log("catch");
				//console.log(err);
			});
		}
	};
	var setPlaying = function(){
		removeOpening();
		$video.attr("data-is-playing", "true");
		//$v.attr("controls", "");
	};
	var unsetPlaying = function(){
		$video.attr("data-is-playing", "false");
		//$v.attr("controls", null);
	};
	var isPlaying = function(){
		return $video.attr("data-is-playing") == "true";
	};
	//
	var bPlaying = false;
	var video_id="";
	video_id = $video.find("[data-controlled-element='inline-video']").attr("data-target").replace("#","");
	//console.log(video_id);
	//var $v = $video.find("video");
	var $v = $("#"+video_id).find("video");
	$v.on("play playing pause abort error ended canplay", function(e){
		try{
			//console.log(e);
			onchange(e.type);
		}catch(err){
			console.error(err);
		}
	});			
	$v.find("source").on("play playing pause abort error ended canplay", function(e){
		try{
			//console.log(e);
			onchange(e.type);
		}catch(err){
			console.error(err);
		}
	});
	$video.find("[data-role='inline-video-overlay']").on("click", function(){
		try{
			$video.find("[data-controlled-element='inline-video-modal']").insertBefore(".main-body-content");
			$("[data-controlled-element='whole-inline-video']").find("#"+video_id).remove();
			if(isPlaying()){
				pauseVideo();
			}else{
				playVideo();	
			}
		}catch(err){
			console.error(err);
		}		
	});
	
	$("#"+video_id).on('hide.bs.modal', function (e) {
		try{
			unsetPlaying();
			pauseVideo();
		}catch(err){
			console.error(err);
		}		
	});
	$("#"+video_id).on('show.bs.modal', function (e) {
		try{
			setPlaying();
			playVideo();	
		}catch(err){
			console.error(err);
		}		
	});
};

var GridsRuler = {};
GridsRuler.init = function($wrapper){
	var refresh = function(){
		$wrapper.css({"position":"relative"});
		$wrapper.width("");
		$wrapper.width($wrapper.width()+"px");
		$wrapper.css({"position":"fixed"});
	};
	
	$wrapper.find(".grids-ruler > div").on("mouseover", function(){
		var $this = jQuery(this);
		$this.width($this.width()+"px");
	});
	$wrapper.find(".grids-ruler > div").on("mouseout", function(){
		jQuery(this).width("");
	});	
	jQuery(window).on("resize", refresh);
	refresh();
};

var IconComboWrapper = {};
IconComboWrapper.init = function($wrapper){
	// add 2 dummy grid for mobile alignment
	$wrapper.append(jQuery("<div class='icon-combo-dummy'></div>"));
	$wrapper.append(jQuery("<div class='icon-combo-dummy'></div>"));
};

var BackToTop = {};
BackToTop.init = function($el){
	$el.find("[data-role='back-to-top-button']").on("click", function(){
		jQuery("html,body").stop().animate({scrollTop:0}, 500, 'swing');
	});
};

var ContentToggle = {};
ContentToggle.init = function($el){
	$el.find("[data-role='content-toggle-trigger']").on("click", function(){
		var bOpen = $el.attr("data-open") == "true" ;
		$el.attr("data-open", !bOpen);
	});
};

var SlideCarousel = {};
SlideCarousel.init = function($el){
	if($el.find(".swiper-slide").length == 1){
		return;
	}
	var DELAY = 5000;
	var SLIDE_SPEED = 500; // in ms
	var containerEl  = $el.find("[data-role='swiper-container']")[0];
	var paginationEl = $el.find("[data-role='swiper-pagination']")[0];
	var slide_swiper = new Swiper(containerEl, {
		slidesPerView: 1,
		spaceBetween: 0,
		grabCursor: true,
		loop: true,
		speed: SLIDE_SPEED,
		
		autoplay: {
    		delay: DELAY,
    		disableOnInteraction: false
  		},
		pagination: {
			el: paginationEl,
			bulletClass: 'slide-carousel__swiper-pagination-bullet',
			bulletActiveClass: 'slide-carousel__swiper-pagination-bullet--active',
			clickable: true
		}
	});
	$el.find("[data-role='slide-prev-button']").on("click", function(){
		slide_swiper.slidePrev(SLIDE_SPEED);
	});
	$el.find("[data-role='slide-next-button']").on("click", function(){
		slide_swiper.slideNext(SLIDE_SPEED);
	});
};

var MainHeader = {};
MainHeader.init = function($el){
	// init sticky
	var sticky = ($el.attr("data-sticky") == "true");
	if(sticky){
		jQuery(window).on("scroll", function(){
	        if(screen.availWidth>=600){
				if(jQuery(window).scrollTop() >= 30){
					$el.addClass("main-header-main-wrapper--header-float");
					jQuery(".main-header-top-wrapper").css("margin-bottom", $el.innerHeight());
				}else{
					$el.removeClass("main-header-main-wrapper--header-float");
					jQuery(".main-header-top-wrapper").css("margin-bottom", "0px");
				}
			}else{
				if(jQuery(window).scrollTop() > 0){
					$el.addClass("main-header-main-wrapper--header-float");
				}else{
					$el.removeClass("main-header-main-wrapper--header-float");
				}
			}
		});	
	}
};

var MainDesktopMenu = {};
MainDesktopMenu.init = function($menu, $dropdowns){
	//var mainMenuButtonMouseOverTimer = null;
	var initMainMenuButtonTouch = function($btn){

		$btn.find("[data-role='main-menu-button-a']").on("click", function(e){
			var $this = jQuery(this);
			var over = $btn.attr("data-touch-over") == "true";
			if(!over){
				e.preventDefault();
			}
		});
		$btn.mouseover(function(){
			$btn.attr("data-touch-over", "true");
			/*
			clearTimeout(mainMenuButtonMouseOverTimer);
			mainMenuButtonMouseOverTimer = setTimeout(function(){
				$btn.attr("data-touch-over", "true");
			}, 50);
			*/
		});
		$btn.mouseout(function(){
			//clearTimeout(mainMenuButtonMouseOverTimer);
			$btn.attr("data-touch-over", "false");
		});
		
		$btn.find("[data-role='dropdown-touch-bg']").on("click", function(e){
			//console.log("bg");
			e.stopPropagation();
			$btn.trigger("mouseout");

		});
	};
	var initTouch = function(){
		if(!jQuery("html").hasClass('touchevents')){
			return;
		}
		$menu.find("[data-role='main-menu-button']").each(function(){
			initMainMenuButtonTouch(jQuery(this));
		});
	};
	//
	$dropdowns.find("[data-role='main-menu-dropdown'],[data-role='main-menu-dropdown-simple']").each(function(){
		var $dropdown = jQuery(this);
		var section_id = $dropdown.attr("data-main-section-id");
		$menu.find("[data-role='main-menu-button']").filter("[data-main-section-id='"+section_id+"']").append($dropdown);
	});
	// init the dropdown after appended
	initTouch();
};
var debug = function(s){
	var $debug = jQuery("#debug");
	var $div = jQuery("<div></div>");
	$div.text(s);
	$debug.append($div);
};
var RddpPricing = {};
RddpPricing.init = function($el){
	var lang = $el.attr("data-lang");
	//
	var getDestinationOption = function(data){
		//console.log({value: data.name_english, label:data["name_" + lang]});
		return {value: data.name_english, label:data["name_" + lang]};
	};
	var getRegions = function(callback){
		
		var url = $el.attr("data-regions-source");
		var options = {url: url, dataType:"json"};
		//alert(JSON.stringify(options));
		jQuery.ajax(options)
		.done(function( data, textStatus, jqXHR ) {
			//alert(JSON.stringify(data));
			if(data) {
				if(data.status == "success"){
					if(data.region){
						var region_options = [];
						var destination_options = {};
						// default option
						var $default_option = $el.find("[data-role='region-default-option']");
						if($default_option.length == 1){
							region_options.push({label: $default_option.text(), value: $default_option.attr("value")});
							$default_option.remove();
						}
						var destination_options_1 = [];
						for(var i=0 ; i < data.region.length ; i++){
							var region = data.region[i];
							var label = region["region_" + lang] || "";
							if(label != ""){
								var option = {
									value: ""+ (2+i),
									label: label
								}
								region_options.push(option);
							}
							if(region.country_list){
								var country_options = [];
								for(var j=0 ; j < region.country_list.length ; j++){
									destination_options_1.push(getDestinationOption(region.country_list[j])); 
									country_options.push(getDestinationOption(region.country_list[j]));
								}
								destination_options["destination_options_" + (2+i)] = country_options;
							}
						}
						destination_options["destination_options_1"] = destination_options_1;
						callback(region_options, destination_options);
					}
				}
			}
		})
		.fail(function( jqXHR, textStatus, errorThrown ) {
			//alert(textStatus);
			//alert(errorThrown);
			console.log("fail");
		});
	};
	var initQSelect = function(destination_options){
		var $seed = $el.find("[data-role='destination-select-seed']");
		for(var key in destination_options){
			//console.log(key);
			var $select = $seed.clone();
			$select.attr("data-role", null);
			$select.addClass("rddp-pricing__destination-select-" + key);
			$select.attr(":options", key);
			$select.insertAfter($seed);		
		}
		$seed.remove();
	};
	var addStyle = function(destination_options){
		var selectors = []
		for(var key in destination_options){
			var num = key.substring("destination_options_".length);
			var selector = ".rddp-pricing__controls-wrapper[data-region='"+num+"'] .rddp-pricing__destination-select-" + key;
			selectors.push(selector);
		}
		var $style = jQuery("<style>\n" + selectors.join(",") + "{display:block;}\n</style>");

		jQuery("body").append($style);
	};
	var isBusy = function(){
		return $el.attr("data-busy") == "true";
	};
	var setBusy = function(){
		$el.attr("data-busy", "true");
	};
	var unsetBusy = function(){
		$el.attr("data-busy", "false");
	};
	// skip duplicate
	// skip country_name=='China' && operator=='SmarTone'
	var filter_result = function(input, country_name){
		var list = [];
		var result = [];
		if(input != null){
			var len = input.length;
			for(var i=0 ; i<len ; i++){
				var op = input[i];
				var operator = op.operator;
				if(list.indexOf(operator) >= 0){
					// duplicate
					continue;
				}else if( (country_name=="China") && (operator=="SmarTone") ){
					continue;
				}else{
					// new
					list.push(operator);
					result.push(op);
				}
			}
		}
		return result;
	};
	var fail_open = function(){
		// do nothing
		unsetBusy();
	};
	var render_table = function(operators){
		
		var getOperatorLabel = function(op){
			var $td = jQuery("<td data-temp='true' align=center></td>");
			var operator = op.operator;
			var operator_url = op.operator_url || "";
			if(operator_url == ""){
				$td.text(operator);
			}else{
				var $a = jQuery("<a target='_blank'></a>");
				$a.attr("href", operator_url);
				$a.text(operator);
				$td.append($a);
			}
			return $td;
		};
		var getPeakCell = function(op){
			var $td = jQuery("<td data-temp='true' align=center></td>");
			var value = op["call_within_same_city_peak_" + lang];
			$td.text(value);
			return $td;
		};
		var getOffPeakCell = function(op){
			var $td = jQuery("<td data-temp='true' align=center></td>");
			var value = op["call_within_same_city_off_peak_" + lang];
			$td.text(value);
			return $td;
		};
		//
		var $header   = $el.find("[data-role='operator-name-row']");
		var $peak_row = $el.find("[data-role='peak-row']");
		var $off_peak_row = $el.find("[data-role='off-peak-row']");
		for(var i=0;i<operators.length ;i++){
			var op = operators[i];
			$header.append(getOperatorLabel(op));
			$peak_row.append(getPeakCell(op));
			$off_peak_row.append(getOffPeakCell(op));
		}
		showTable();
	};
	var $table = $el.find("[data-role='pricing-table']");
	var showTable = function(){
		$table.attr("data-visible", "true");
	};
	var resetTable = function(){
		$table.attr("data-visible", null);
		$table.find("[data-temp='true']").remove();
	};
	var openDestination = function(value){
		
		if(isBusy()){
			return;
		}
		resetTable();
		setBusy();
		//console.log(value);
		// special case - Macau
		if(value == "Macau"){
			value = "China - Macau&rddp_check=off";
		}		
		var qs = "country_name=" + value;
		var param = qs.split("&");
		var list = [];
		for(var i=0;i<param.length;i++){
			var p = param[i];
			var pair = p.split("=");
			list.push(pair[0] + "=" + encodeURIComponent(pair[1]));
		}
		var url = $el.attr("data-pricing-source") + "?" + list.join("&");
		//console.log(url);
		var options = {url: url, dataType:"json", method:"GET"};
		jQuery.ajax(options)
		.done(function( data, textStatus, jqXHR ) {
			if(data){
				if(data.status =="success"){
					//console.log("before filter = "+data.autoroaming.length);
					var operators = filter_result(data.autoroaming, value);
					//console.log("after filter = "+operators.length);
					render_table(operators);
					unsetBusy();
					return;
				}
			}
			fail_open();
		})
		.fail(function( jqXHR, textStatus, errorThrown ) {
			fail_open();
		});
	};
	var initVue = function(region_options, destination_options){
		//console.log("initVue...");
		
		var data = {
			region: "1",
	    	destination: "",   	
		    region_options: region_options
		};
		// add destination_options
		for(var key in destination_options){
			data[key] = destination_options[key];
		}
		//console.log(data);
		var $vueWrapper = $el.find("[data-role='vue-wrapper']");
		if($vueWrapper.length > 0){
			var myVue = new Vue({
			  	el: $vueWrapper[0],
			  	data: function () {
				    return data;
			  	},
			  	methods: {
			  		regionChanged: function(){
			  			//console.log("regionChanged " + this.region);
			  			this.destination = "";
			  		},
			  		destinationChanged: function(){
			  			//console.log("destinationChanged " + this.destination);
			  		},
			  		clickShortcut: function(event){
			  			var value = jQuery(event.currentTarget).attr("data-value");
			  			openDestination(value);
			  		},
				  	clickGo: function(){
				  		if(this.destination == ""){
				  			return;
				  		}
				  		openDestination(this.destination);
				  	}
			  	},
			  	mounted: function(){
			  		//console.log("mounted");
			  	}
			});
		}
	};
	var initShortcuts = function(){
		$el.find("[data-role='shortcut-button']").on("click", function(){
			var value = jQuery(this).attr("data-value");
			openDestination(value);
		});
	};
	// get regions by ajax first
	getRegions(function(region_options,destination_options){
		initQSelect(destination_options);
		addStyle(destination_options);
		initVue(region_options,destination_options);
		initShortcuts();
	});
	
};
var PlanCardListSwiper = {};
PlanCardListSwiper.init = function($el){
	var $elContainer = $el.find('.swiper-container');
	if($elContainer.length == 0){
		return;
	}
	if($elContainer.find(".swiper-slide").length < 2){
		return;
	}
	var init = function(){
		$el.attr("data-init","true");
		var elContainer = $elContainer[0];
		var options = {
			direction: 'horizontal',
			loop: true,
			slidesPerView: 1.2,
			centeredSlides: true,
			spaceBetween: 10
		};
		var $prevEl = $el.find("[data-role='prev-slide-button']");
		var $nextEl = $el.find("[data-role='next-slide-button']");
		if(($prevEl.length > 0) && ($nextEl.length > 0)){
			options.navigation = {
				prevEl: $prevEl[0],
				nextEl: $nextEl[0]
			};
		}	
		var swiper = new Swiper(elContainer, options);
		swiper.on('transitionEnd', function() {
		  	var num = swiper.realIndex + 1;
			$el.find("[data-role='current-slide-number']").text(num);  
		});
	};
	// init the swiper when resized to mobile view
	if(!$el.is(":visible")){
		var onResize = function(){
			if(!$el.is(":visible")){
				return;
			}
			jQuery(window).off("resize.PlanCardListSwiper", onResize);
			init();
		};
		jQuery(window).on("resize.PlanCardListSwiper", onResize);
		return;
	}
	init();
};
/////////////////////////////////////////////////////////////////////////////////////////////////
jQuery(document).ready(function(){
	
	jQuery(".grids-ruler-wrapper").each(function(){
		GridsRuler.init(jQuery(this));
	});

	var $controlled = jQuery("[data-controlled-element]");

	/*$controlled.filter("[data-controlled-element='inline-video']").each(function(){
		InlineVideo.init(jQuery(this));
	});*/
	$controlled.filter("[data-controlled-element='whole-inline-video']").each(function(){
		InlineVideo.init(jQuery(this));
	});

	jQuery(".icon-combo-wrapper").each(function(){
		IconComboWrapper.init(jQuery(this));
	});

	$controlled.filter("[data-controlled-element='back-to-top']").each(function(){
		BackToTop.init(jQuery(this));
	});

	$controlled.filter("[data-controlled-element='content-toggle']").each(function(){
		ContentToggle.init(jQuery(this));
	});

	$controlled.filter("[data-controlled-element='slide-carousel']").each(function(){
		SlideCarousel.init(jQuery(this));
	});

	$controlled.filter("[data-controlled-element='main-header']").each(function(){
		MainHeader.init(jQuery(this));
	});

	$controlled.filter("[data-controlled-element='rddp-pricing']").each(function(){
		RddpPricing.init(jQuery(this));
	});
	$controlled.filter("[data-controlled-element='plan-card-list-swiper']").each(function(){
		PlanCardListSwiper.init(jQuery(this));
	});

	// main menu fix
	$controlled.filter("[data-controlled-element='main-desktop-menu']").each(function(){
		MainDesktopMenu.init(jQuery(this), $controlled.filter("[data-controlled-element='main-desktop-menu-dropdowns']"));
	});

	var initDropdown = function($dropdown){
		var $button = $dropdown.find("[data-role='main-menu-dropdown-left-button']");
		var currentIndex = $button.index($button.filter(".main-header-main-wrapper__dropdown__left-link--curent"));
		if(currentIndex >= 0){
			$dropdown.attr("data-current-folder", currentIndex+1);
		}
		
		$button.on("mouseover", function(){
			var $this = jQuery(this);
			var index = $button.index($this);
			$dropdown.attr("data-current-folder", index+1);
		});
	};

	jQuery("[data-role='main-menu-dropdown']").each(function(){
		initDropdown(jQuery(this));
	});

	jQuery("div[data-role='main-menu-dropdown'], div[data-role='main-menu-dropdown-simple']").mouseout(function(){
		jQuery("[data-role='main-menu-button']").children("a").removeClass("main-header-main-wrapper__menu-item-button--border-color");
	});
	
	jQuery("[data-role='main-menu-button']").mouseover(function(){
		jQuery(this).children("a").addClass("main-header-main-wrapper__menu-item-button--border-color");
		jQuery(this).siblings().children("a").removeClass("main-header-main-wrapper__menu-item-button--border-color");
	});

	jQuery("[data-role='main-menu-button']").mouseout(function(){
		//console.log("mouseout");
		/*
		var currentDropdown = jQuery(this).find("div[data-role^='main-menu-dropdown']");
		if(currentDropdown.css("display")== "none"){
			jQuery("[data-role='main-menu-button']").children("a").removeClass("main-header-main-wrapper__menu-item-button--border-color");
		}
		*/
		jQuery(this).find("[data-role='main-menu-button-a']").removeClass("main-header-main-wrapper__menu-item-button--border-color");;
	});
	
	//###########  mobile menu start  ######### /
	//open menu
	jQuery("[data-role='hamburger-button']").bind("click", function(){
		
		var currentBlockList = [];
		var currentPage = null;
		jQuery("[data-role='mobile-menu']").addClass("mobile-menu_open");

		jQuery("[data-role='menu-row']").hide();
		jQuery(".mobile-menu_content [data-current='true']").each(function(){
			currentBlockList.push(jQuery(this));
			jQuery(this).show();
			jQuery(this).children("[data-role='menu-row-button']").hide();
		});
		
		if(currentBlockList.length > 0){
			currentPage = currentBlockList[currentBlockList.length-1];
			currentPage.children("[data-role='menu-row-button']").show();
			currentPage.siblings("[data-role='menu-row']").show();
			currentPage.siblings("[data-role='menu-row']").children("[data-role='menu-row-button']").show();
			jQuery("[data-role='tag-name']").text(currentPage.siblings("[data-role='menu-row-button']").text());
		}
		else{ 
			jQuery("[data-menu-level='L1']").each(function(){
				jQuery(this).show();
				jQuery(this).children("[data-role='menu-row-button']").show();
			})
		}
		jQuery("[data-role='mobile-menu']").attr("data-current-level", currentPage==null?"L1":currentPage.attr("data-menu-level"));
	});

    //close menu
	jQuery(".mobile_shadow").bind("click", function(){
		jQuery("[data-role='mobile-menu']").removeClass("mobile-menu_open");
	})

	//next level
	jQuery("div[data-role='menu-row'] div").bind("click", function(event){
		var $this = jQuery(this);
		if($this.parent().attr("data-has-children")=="true"){

			$this.hide();
			$this.parent().siblings().hide();
			$this.siblings().show();
			$this.siblings().children("[data-role='menu-row-button']").show();
						
			jQuery("[data-role='mobile-menu']").attr("data-current-level", $this.next().attr("data-menu-level"));
			
			var parentName = $this.children("a").text();
			jQuery("[data-role='tag-name']").text(parentName);
		}

		event.stopPropagation();
	});

	var getBlockList = function(){
		var blockUl = [];
		jQuery(".mobile-menu_content > div div[data-role='menu-row']").each(function(){
		    if(jQuery(this).css("display") == "block"){
			    blockUl.push(jQuery(this));
		    };
		})
		return blockUl;
    }

	//prev level
	jQuery("[data-role='go_back-button']").bind("click", function(event){
		var menuBlockUl = [];
		var lastChilren = null;
		
        menuBlockUl = getBlockList();
		if(menuBlockUl.length != 0){
			lastChilren = menuBlockUl[menuBlockUl.length-1];
			jQuery("[data-role='tag-name']").text(lastChilren.parent().siblings("[data-role='menu-row-button']").children("a").text());

            lastChilren.hide();
			lastChilren.siblings("[data-role='menu-row']").hide();
		    lastChilren.siblings("[data-role='menu-row-button']").show();
			lastChilren.parent().siblings("[data-role='menu-row']").show();
			lastChilren.parent().siblings("[data-role='menu-row']").children("[data-role='menu-row-button']").show();
			
			jQuery("[data-role='mobile-menu']").attr("data-current-level", lastChilren.attr("data-menu-level"));
		}

		menuBlockUl = getBlockList();
		if(menuBlockUl.length == 0){
			jQuery("[data-role='mobile-menu']").attr("data-current-level", "L1");
		}

		event.stopPropagation();
	});
	
	if(jQuery('#swiper-container_industry_solutions_banner')[0]) {
		var swiper_industry_solutions_banner = new Swiper('#swiper-container_industry_solutions_banner', {
		  /*slidesPerView: 5,*/
		  grabCursor: true,
		  loop: true,
		  slidesPerView: 3,
		  spaceBetween: 60,
		  centeredSlides: true,
		  slideToClickedSlide: true,
		  preloadImages: true,
		  shortSwipes:true,
		  preventClicksPropagation: false,
		  preventClicks: false,
		  direction: 'horizontal',
		  loopAdditionalSlides: 2,
		  breakpoints: {
			// when window width is <= 599px
			2840: {
			  slidesPerView: 2.5,
			},
			2260: {
			  slidesPerView: 2,
			},
			1796: {
			  slidesPerView: 1.6,
			},
			1448: {
			  slidesPerView: 1.3,
			},
			599: {
			  slidesPerView: 1,
			  spaceBetween: 0,
			}
		  },
		  navigation: {
			nextEl: '.slide-industry_solutions__next-button',
			prevEl: '.slide-industry_solutions__prev-button',
		  },
		});
		
		swiper_industry_solutions_banner.on('slideChangeTransitionEnd', function () {
			var industry_solutions_banner_currentIndex=swiper_industry_solutions_banner.realIndex;
			if(industry_solutions_banner_currentIndex==7) {
				industry_solutions_banner_currentIndex=0;
			}
			//console.log("currentIndex="+industry_solutions_banner_currentIndex);
			jQuery(".slide-industry_solutions-content div").removeClass("active");
			jQuery(".slide-industry_solutions-content div").eq(industry_solutions_banner_currentIndex).addClass("active");
		});
		swiper_industry_solutions_banner.loopDestroy();
		swiper_industry_solutions_banner.loopCreate();
	}
	jQuery(window).on("scroll", function(){		
		showElement('.video-wrapper');
		showElement('#swiper-container_industry_solutions_banner');
		showElement('.slide-industry_solutions-bottom');
		showElement('.industry_solutions-award_container img');
		showElement('.industry_solutions-container_img img');
		showElement('.industry_solutions-container .infographic--desktop');
		showElement('.industry_solutions-container .infographic--mobile .infographic');
	});
	jQuery(window).on("load", function(){		
		showElement('.video-wrapper');
		showElement('#swiper-container_industry_solutions_banner');
		showElement('.slide-industry_solutions-bottom');
		showElement('.industry_solutions-award_container img');
		showElement('.industry_solutions-container_img img');
		showElement('.industry_solutions-container .infographic--desktop');
		showElement('.industry_solutions-container .infographic--mobile .infographic');
	});
	
});
/////////////////////////////////////////////////////////////////////////////////////////////////
function showElement(ele) {
	jQuery(ele).each(function() {
		
		/*var hT = jQuery(this).offset().top,
		   hH = jQuery(this).outerHeight(),
		   wH = jQuery(window).height(),
		   wS = jQuery(window).scrollTop();
		if (wS+hH > (hT+space)){*/
		if(jQuery(window).scrollTop() + jQuery(window).innerHeight() >= jQuery(this).offset().top) {
		   jQuery(this).addClass("animated");
		   /*console.log('wS+hH='+(wS+hH));
		   console.log('hT='+hT);
		   console.log('video start the view!');*/
		   /*jQuery(this).css({
			   opacity: 1,
			   transition: "transform 0.5s",
			   transform: "translateY(0px)"
			});*/
		} /* else {
		   jQuery(this).removeClass("animated");
		  jQuery(this).css({
			   opacity: 0,
			   transition: "transform 0.5s",
			   transform: "translateY(40px)
			});
		}*/
	});
}

var ga = function(temp1, temp2, eventCategory, eventAction, eventLabel){
	if (typeof eventCategory=="undefined" || typeof eventAction=="undefined" || typeof eventLabel=="undefined"){
		return;
	}
	//console.log("eventCategory|"+eventCategory+", eventAction|"+eventAction+", eventLabel|"+eventLabel);
	dataLayer.push({'event':'GAClickEvent','ga_click_category':eventCategory,'ga_click_action':eventAction,'ga_click_label':eventLabel});
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// Polyfill
/////////////////////////////////////////////////////////////////////////////////////////////////
// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    },
    configurable: true,
    writable: true
  });
}