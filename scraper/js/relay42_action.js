// general

var loading = true;

var relay42function = function(){
	// add event cross browser
	this.addEvent = function(elem, event, fn) {
	    if (elem.addEventListener) {
	        elem.addEventListener(event, fn, false);
	    } else {
	        elem.attachEvent("on" + event, function() {
	            // set the this pointer same as addEventListener when fn is called
	            return(fn.call(elem, window.event));   
	        });
	    }
	}
	//
	this.ready = function(fn) {
	  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
	    fn;
	  } else {
	    document.addEventListener('DOMContentLoaded', fn);
	  }
	}
}
var setLoading = function(flag) {
	if (!flag) {
		jQuery(".loadingSpin").css("display","none");
	}
}

var debugMessage = function(sMsg){
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	if (document.location.href.indexOf("webstage7a") == -1 || !isMobile){
		return;
	}
	var $message = jQuery("<div></div>");
	$message.css({"padding":"30px 20px 100px","background":"#eeeeee","text-align":"center"});
	$message.html("<span style='color:#ff0000'>R42 DEBUG</span> "+sMsg);	
	jQuery("body").append($message);
	console.log(sMsg);
}
// relay 42
var RELAY42ACTION = {};
var RELAY42CALLBACKS = {};
RELAY42ACTION.adTimeoutDuration = 3000; // temp
RELAY42ACTION.adTimeoutTimer = null;
RELAY42ACTION.templateCallback = {};

RELAY42ACTION.error = function(s, config){
	console.error("*r42", s, config);
};
RELAY42ACTION.log = function(s){
	return;
	console.log("*r42",s);
};
RELAY42ACTION.info = function(s){
	console.log("#r42",s);
};
RELAY42ACTION.optString = function(obj, name){
	if(obj == null){
		return "";
	}
	return (obj[name]||"").trim();
};
RELAY42ACTION.getAllPlacements = function(){
	return jQuery("[data-placement-r42]");
};
RELAY42ACTION.getPlacement = function(placement_id, template_name){
	return RELAY42ACTION.getAllPlacements().filter("[data-placement-id='"+placement_id+"'][data-placement-type='"+template_name+"']");
};
RELAY42ACTION.getPlacementFunction = function(template_function){
	var placementFunction = null;
	var functions = template_function.split(".");

	var isObjectFunction = function(elem){
		return (typeof elem === "function" || typeof elem === "object");
	}
	var isFunction = function(elem){
		return (typeof elem === "function");
	}
	if (isObjectFunction(window[functions[0]])){
		placementFunction = window[functions[0]];	
		for (var i=1; i<functions.length; i++){
			if (isObjectFunction(placementFunction[functions[i]])){
				placementFunction = placementFunction[functions[i]];
			}
		}
	}
	return isFunction(placementFunction)?placementFunction:null;
};
RELAY42ACTION.mapTemplateNameToGaCategory = function(templateName){
	var MAPPING = {
		"DetailTopPromo"  : "relay42_os_top_msg",
		"ProdTile"        : "relay42_os_grid_item",
		"StoreHeroBanner" : "relay42_os_banner",
		"ShopCmsTypeImage": "relay42_os_grid_image",
		"SectionImageBox" : "relay42_cw_promotion",
		"TopMainBanner"   : "relay42_cw_banner",
		"CartPromo"       : "relay42_os_cart_promo",
		"ShopImgSwap"	  : "relay42_os_retention_banner",
		"HomePopupBanner" : "relay42_cw_popup_banner"
	};
	return MAPPING[templateName];
}
// get from mapping first, and then from config
RELAY42ACTION.getGaCategory = function(config){
	try{
		var ga_category = RELAY42ACTION.mapTemplateNameToGaCategory(config.template.name);
		if(ga_category){
			return ga_category;
		}
	}catch(err){
		console.error(err);
	}
	// use config.ga_category if mapping not contains the template name
	return (typeof config.ga_category=="undefined")? "relay42" : "relay42_" + config.ga_category;
};
RELAY42ACTION.setupGaClickEvent = function(config, $button){
	if(!config){
		return;
	}

	var ga_page     = (typeof config.ga_page=="undefined")? "" : "_" + config.ga_page;
	var ga_category = RELAY42ACTION.getGaCategory(config);
	var ga_label    = config.campaign + "_" + config.ad + ga_page;
	$button.attr("data-r42-ga-event-category", ga_category);
	$button.attr("data-r42-ga-event-label"   , ga_label);

	$button.on("click", function(){
		var $this = jQuery(this);
		var ga_options = {
			hitType      : "event",
			eventCategory: $this.attr("data-r42-ga-event-category"),
			eventAction  : "click",
			eventLabel   : $this.attr("data-r42-ga-event-label")
		};
		if (RELAY42ACTION.hasDimension(config)){
			var dimension = config.dimension;
			var dimension_id = "dimension"+dimension.id;
			ga_options[dimension_id] = dimension.value;
		}	
		RELAY42ACTION.sendGA(ga_options);
	});
};
RELAY42ACTION.findGA = function(){
	if(typeof ga != "undefined"){
		return ga;
	}
	if(typeof ga2 != "undefined"){
		return ga2;
	}
	if(typeof ga3 != "undefined"){
		return ga3;
	}
	return null;
};
RELAY42ACTION.sendGA = function(options, remaining){
	var MAX_TRIAL = 20;
	if(typeof remaining === "undefined"){
		remaining = MAX_TRIAL;
	}
	RELAY42ACTION.log("sendGA remaining "+remaining);
	if(remaining <= 0){
		RELAY42ACTION.log("sendGA done");
		return;
	}
	var the_ga = RELAY42ACTION.findGA();
	if( (typeof the_ga === "undefined") || (the_ga == null) ){
		remaining--;
		RELAY42ACTION.log("ga undefined, delay 1000..., remaining " + remaining);
		setTimeout(function(){
			RELAY42ACTION.sendGA(options, remaining);
		}, 1000);
	}else{
		RELAY42ACTION.info("send ga: " + JSON.stringify(options));
		the_ga('send', options);
	}
};
RELAY42ACTION.hasDimension = function(config){
	var dimension = config.dimension || "";
	var dimension_id = dimension.id;
	var dimension_value = dimension.value;
	return (typeof dimension_id !== "undefined" && typeof dimension_value !== "undefined");
}
RELAY42ACTION.setDimension = function(config, remaining){
	var MAX_TRIAL = 20;
	if(typeof remaining === "undefined"){
		remaining = MAX_TRIAL;
	}
	RELAY42ACTION.log("setDimension remaining "+remaining);
	if(remaining <= 0){
		RELAY42ACTION.log("setDimension done");
		return;
	}
	if (!RELAY42ACTION.hasDimension(config)){
		return;
	}
	var the_ga = RELAY42ACTION.findGA();
	if( (typeof the_ga === "undefined") || (the_ga == null) ){
		remaining--;
		RELAY42ACTION.log("ga undefined, delay 1000..., remaining " + remaining);
		setTimeout(function(){
			RELAY42ACTION.setDimension(config, remaining);
		}, 1000);
	}else{
		RELAY42ACTION.info("set dimension: " + JSON.stringify(config));
		var dimension = config.dimension;
		var dimension_id = "dimension"+dimension.id;
		var dimension_value = dimension.value;
		the_ga('set', dimension_id, dimension_value);
		setCookie(dimension_id, dimension_value, "", "/");
	}
};
RELAY42ACTION.counter = function(config, action){

	// only apply ga when action="start"
	// ga
	if(action == "start"){
		var ga_category = RELAY42ACTION.getGaCategory(config);
		var ga_page = (typeof config.ga_page=="undefined")? "" : "_" + config.ga_page;
		var ga_options = {
			hitType      : 'event',
			eventCategory: ga_category,
			eventAction  : 'Impression',
			eventLabel   : config.campaign + "_" + config.ad + ga_page
		};	
		
		if (RELAY42ACTION.hasDimension(config)){
			var dimension = config.dimension;
			var dimension_id = "dimension"+dimension.id;
			ga_options[dimension_id] = dimension.value;
		}
		RELAY42ACTION.sendGA(ga_options);
	}	

	// counter
	var counter = RELAY42ACTION.optString(config, "counter");
	if(counter == ""){
		//RELAY42ACTION.error("counter is empty", config);
	}else{
		try{
			RELAY42ACTION.log("Call counter {campaign: " + config.campaign + ", ad: " + config.ad + ", counter: " + counter+", action: "+action+"}");
			_st.counter.call(counter);
		}catch(err){
			RELAY42ACTION.error(err, config);
		}	
	}	
};
RELAY42ACTION.testImgLoad = function(src, loadCallback, errorCallback){
	var $img = jQuery("<img/>");
	if(loadCallback){
		$img.on("load", function(){
			loadCallback();
		});
	}
	if(errorCallback){
		$img.on("error", function(){
			errorCallback();
		});
	}
	$img.attr("src", src);
};
RELAY42ACTION.timeoutCounter = function($p){
	RELAY42ACTION.log("timeout counter, {type: "+ $p.attr("data-placement-type") + ", id: " + $p.attr("data-placement-id") + "}");
};
RELAY42ACTION.getLang = function(){
	var sLang = "english";
	try{
		if ( typeof window._st === "function" ){
			if (typeof _st.data !== "undefined"){
				sLang = _st.data._tagProperties.language
			}
		}
	} catch (sLang){
		RELAY42ACTION.error(err);
	}	
	return sLang;
};
RELAY42ACTION.runTemplate = function(config, $placement){
	try{
		RELAY42ACTION.info("HIT {campaign:" + config.campaign + ", ad:" + config.ad + ", placement_id:" + config.placement_id + ", template.name:" + config.template.name + "}");
	}catch(err){}
	//
	var runCallback = function($p, template_name, template_action, template_callback){
		if(template_action == "start"){
			RELAY42ACTION.counter(config, "start");
			if(template_callback.start){
				try{
					template_callback.start(RELAY42ACTION.getLang(), $p, config);
				}catch(err){
					RELAY42ACTION.error(err);
				}
			}else{
				RELAY42ACTION.error("missing start callback for template " + template_name);
			}
			RELAY42ACTION.setPlacementStatus($p, "started");
		}else if(template_action == "none"){
			RELAY42ACTION.counter(config, "none");
			if(template_callback.close){
				try{
					template_callback.close(RELAY42ACTION.getLang(), $p, config);
				}catch(err){
					RELAY42ACTION.error(err);
				}
			}else{
				RELAY42ACTION.error("missing close callback for template " + template_name);
			}
			RELAY42ACTION.setPlacementStatus($p, "closed");
		}else{
			RELAY42ACTION.counter(config, "unknown");
			RELAY42ACTION.error("unknown template action = "+template_action);
		}
	};
	//
	var template = config.template;
	if(template == null){
		RELAY42ACTION.error("template not found", config);
		return;
	}
	var template_name = RELAY42ACTION.optString(template, "name");
	if(template_name == ""){
		RELAY42ACTION.error("template name not found", config);
		return;
	}

	var template_callback = RELAY42ACTION.templateCallback[template_name];
	if(template_callback == null){
		RELAY42ACTION.error("Missing template callback = " + template_name);
		return;
	}

	// test to skip run callback, or not
	// this callback is optional
	var test_callback = template_callback.test;

	var template_action = RELAY42ACTION.optString(template, "action");
	template_action = (template_action=="") ? "start" : template_action ;
	//RELAY42ACTION.log("template_action = " +template_action);

	$placement.each(function(){
		var $p = jQuery(this);
		var bRun = true;
		// test per placment to skip run callback, or not
		// this callback is optional
		if(test_callback != null){
			var test_result = test_callback(RELAY42ACTION.getLang(), $p, config);
			if(test_result === false){
				RELAY42ACTION.log("test callback returns false, skip callback");
				bRun = false;
			}
		}
		if(bRun){
			runCallback($p, template_name, template_action, template_callback);
		}
	});

	//console.log(config);
	//console.log("lang = "+_st.data._tagProperties.language);
};
RELAY42ACTION.runTemplateFunction = function(config, placementFunction){
	try{
		RELAY42ACTION.info("HIT {campaign:" + config.campaign + ", ad:" + config.ad + ", placement_id:" + config.placement_id + ", template.name:" + config.template.name + "}");
	}catch(err){}
	//
	var runCallback = function(placementFunction, template_name, template_action, template_callback){
		if(template_action == "start"){
			RELAY42ACTION.counter(config, "start");
			if(template_callback.start){
				try{
					template_callback.start(RELAY42ACTION.getLang(), placementFunction, config);
				}catch(err){
					RELAY42ACTION.error(err);
				}
			}else{
				RELAY42ACTION.error("missing start callback for template " + template_name);
			}
			//RELAY42ACTION.setPlacementStatus(placementFunction, "start");
		}else{
			RELAY42ACTION.counter(config, "unknown");
			RELAY42ACTION.error("unknown template action = "+template_action);
		}
	};
	//
	var template = config.template;
	if(template == null){
		RELAY42ACTION.error("template not found", config);
		return;
	}
	var template_name = RELAY42ACTION.optString(template, "name");
	if(template_name == ""){
		RELAY42ACTION.error("template name not found", config);
		return;
	}

	var template_callback = RELAY42ACTION.templateCallback[template_name];
	if(template_callback == null){
		RELAY42ACTION.error("Missing template callback = " + template_name);
		return;
	}

	// test to skip run callback, or not
	// this callback is optional
	var test_callback = template_callback.test;

	var template_action = RELAY42ACTION.optString(template, "action");
	template_action = (template_action=="") ? "start" : template_action ;
	//RELAY42ACTION.log("template_action = " +template_action);


	var bRun = true;
	// test per placment to skip run callback, or not
	// this callback is optional
	if(test_callback != null){
		var test_result = test_callback(RELAY42ACTION.getLang(), placementFunction, config);
		if(test_result === false){
			RELAY42ACTION.log("test callback returns false, skip callback");
			bRun = false;
		}
	}
	if(bRun){
		runCallback(placementFunction, template_name, template_action, template_callback);
	}
};
RELAY42ACTION.adTimeout = function(){
	RELAY42ACTION.log("ad timeout");
    var $allPlacements = RELAY42ACTION.getAllPlacements();
    RELAY42ACTION.log("$allPlacements.length=" + $allPlacements.length);
	$allPlacements.each(function(){
		var $p = jQuery(this);
		if(RELAY42ACTION.getPlacementStatus($p)!=""){
			RELAY42ACTION.log(RELAY42ACTION.getPlacementType($p) + "::" + RELAY42ACTION.getPlacementId($p) + " " + RELAY42ACTION.getPlacementStatus($p) + ", skip");
			return true; // return non-false inside each() act as "continue"
		}
		RELAY42ACTION.log("close the placement...");
		RELAY42ACTION.timeoutCounter($p);
		var template_name = ($p.attr("data-placement-type") || "").trim();
		if(template_name == ""){
			RELAY42ACTION.error("Missing data-placement-type, data-placement-id="+ $p.attr("data-placement-id"));
		}else{
			var template_callback = RELAY42ACTION.templateCallback[template_name];
			if(template_callback == null){
				RELAY42ACTION.error("Missing template callback = " + template_name);
			}else{
				try{
					template_callback.close(RELAY42ACTION.getLang(), $p);
				}catch(err){
					RELAY42ACTION.error(err);
				}	
			}
			RELAY42ACTION.setPlacementStatus($p, "closed");	
		}
		
	});
};
RELAY42ACTION.getPlacementId = function($p){
	return ($p.attr("data-placement-id")||"").trim();
};
RELAY42ACTION.getPlacementStatus = function($p){
	return ($p.attr("data-placement-status")||"").trim();
};
RELAY42ACTION.getPlacementType = function($p){
	return ($p.attr("data-placement-type")||"").trim();
};
RELAY42ACTION.setPlacementStatus = function($p, value){
	$p.attr("data-placement-status", value);
};
RELAY42ACTION.intlNode = function(lang, node){
	if(node == null){
		return null;
	}
	var clone = JSON.parse(JSON.stringify(node));
	var target = (lang=="english") ? clone.english : clone.tchinese;
	for(var key in target){
		clone[key] = target[key];
	}
	delete clone.tchinese;
	delete clone.english;	
	return clone;
}
RELAY42ACTION.unloadCmsTemplatePlacementLoading = function($p){
	var $loading = $p.find(".cms-template-placement__loading")
	$loading.fadeOut(200, function(){
		$loading.remove();
	});
};
/////////////////////////////////////////////////////////////////////////////////////
// add template callback here
RELAY42ACTION.templateCallback.DetailTopPromo = {
	// ignore show_when_empty
	/*
	test: function(lang, $placement, config){
		var bEmpty = $placement.attr("data-placement-empty") == "true";
		if(bEmpty){
			var content = RELAY42ACTION.intlNode(lang, config.template.content);
			if(content.show_when_empty === true){
				//
			}else{
				RELAY42ACTION.log("placement is empty, test callback returns false on 'replace only' (show_when_empty != true) Ad");
				return false;
			}
		}
		return true;
	},*/
	start: function(lang, $placement, config){
		var getChildren = function(content){
			var href = RELAY42ACTION.optString(content, "href");
			var $title = getTitle(content);
			if(href == ""){
				return $title;
			}
			var $a = getLink(content);
			$a.append($title);
			return $a;
		};
		var getLink = function(content){
			var $a = jQuery("<a></a>");
			var href = RELAY42ACTION.optString(content, "href");
			$a.attr("href", href);
			var target = RELAY42ACTION.optString(content, "target");
			if(target != ""){
				$a.attr("target", target);
			}
			return $a;
		};
		var getTitle = function(content){
			return jQuery("<div>" + content.html + "</div>");
		};
		//
		RELAY42ACTION.log("DetailTopPromo start");
		//var content = config.template.content[lang];
		var content = RELAY42ACTION.intlNode(lang, config.template.content);
		var bEmpty = $placement.attr("data-placement-empty") == "true";

		// ignore show_when_empty
		/*
		if(bEmpty){
			if(content.show_when_empty === true){
				RELAY42ACTION.log("show_when_empty");
			}else{
				RELAY42ACTION.log("replace only");
				return;
			}
		}
		*/

		var bHasContent = !bEmpty;

		if(content){
			var $contentWrapper = $placement.find(".st-details__top-promo-message-content");
			$contentWrapper.children().remove();
			$contentWrapper.append(getChildren(content));
			bHasContent = true;
		}else{
			RELAY42ACTION.error("Missing template content");
		}
		if(bHasContent){
		$placement.slideDown(400);		
		}
	},
	close: function(lang, $placement){
		RELAY42ACTION.log("DetailTopPromo close");
		var bEmpty = $placement.attr("data-placement-empty") == "true";
		if(!bEmpty){
			$placement.slideDown(400);
		}		
	}
};
// add more callback
RELAY42ACTION.templateCallback.GridImageBox = {
	start: function(lang, $placement, config){
		// TBA
	},
	close: function(lang, $placement){
		$placement.find(".loadingSpin").css("display","none");
	}
};
// SectionImageBox callback
RELAY42ACTION.templateCallback.SectionImageBox = {
	start: function(lang, $placement, config){
		var jContent = config.template.content;
		if (typeof jContent != "undefined"){
			for (var i=0;i<jContent.length;i++){
				RELAY42ACTION.log("SectionImageBox start");
				var iSequence = jContent[i].sequence;
				var sContent = jContent[i][lang];
				var $section = $placement.find(".section-paragraph-img").eq(iSequence);
				var $sectionParagraph = jQuery("<div class='section-paragraph-img' data-type='new-promo-section'></div>");
				var $sectionImgCol = jQuery("<div class='section-img-col'></div>");
				var $sectionParaCol = jQuery("<div class='section-paragraph-col'></div>");
				var $paraSubtitle= jQuery("<h3 class='text-center text-lg-left paragraph-sub-title'></h3>")
				var $paraTitle = jQuery("<h2 class='text-center text-lg-left paragraph-title'></h2>");
				var $paraContent = jQuery("<p class='text-center text-lg-left paragraph-p'></p>");
				var $buttonContainer = jQuery("<div class='d-flex align-items-center'></div>");	
				var jButton = sContent.button;				

				$sectionImgCol.attr('style', 'background-image: url('+sContent.img+') !important');
				$paraSubtitle.html(sContent.subtitle);
				$paraTitle.html(sContent.title);
				$paraContent.html(sContent.content);
				$buttonContainer.addClass("section-two-button");	
				for (var j=0;j<jButton.length;j++){
					var $btn = jQuery("<a class=\"btn r2w btn-home-line  mr-lg-5 ml-lg-0\" data-r42-id=\"r42-section-button-"+j+"\"></a>");
					if (jButton.length>1 && j==0){
						$btn.attr("style","margin-right: 3rem");
					}
					$btn.text(jButton[j].text);
					$btn.attr("href",jButton[j].url);
					$btn.attr("target",jButton[j].target);
					//$btn.attr("onclick","_gaq.push(['_trackEvent','"+jButton[j].ga_page+"', 'Click', '"+jButton[j].ga_label+"'])");
					$buttonContainer.append($btn);
				}

				$sectionParaCol.append($paraSubtitle);
				$sectionParaCol.append($paraTitle);
				$sectionParaCol.append($paraContent);
				$sectionParaCol.append($buttonContainer);					
				$sectionParagraph.append($sectionImgCol);
				$sectionParagraph.append($sectionParaCol);

				if ($section.length > 0){
					$sectionParagraph.insertBefore($section);
				} else {
					$placement.append($sectionParagraph);
				}

				var $button1 = $placement.find("[data-r42-id='r42-section-button-0']");
				var $button2 = $placement.find("[data-r42-id='r42-section-button-1']");
				if ($button1.length>0){
					RELAY42ACTION.setupGaClickEvent(config, $button1);
				}
				if ($button2.length>0){
					if (typeof jButton[1].ga_page != "undefined"){
						config.ga_page = jButton[1].ga_page;
					}
					RELAY42ACTION.setupGaClickEvent(config, $button2);
				}
			}
		}
		$placement.find(".section-paragraph-img").attr("data-placement-hide","");		
	},
	close: function(lang, $placement){
		RELAY42ACTION.log("SectionImageBox close");
		$placement.find(".section-paragraph-img").attr("data-placement-hide","");
	}
};
// MainBannerInsert callback
RELAY42ACTION.templateCallback.TopMainBanner = {
	start: function(lang, $placement, config){
		var jContent = config.template.content;
		var sSupportUrl = config.support_url || "";
		var iSequence = config.template.content.sequence || 0;

		var isEng = function(){
            return lang=="english";
        }

		var isSupportPath = function(sSupportUrl){
			if (sSupportUrl==""){
				return true;
			}
			var sUrl = document.location.href;
			var sDomain = document.location.origin;
			for (var i=0; i<sSupportUrl.length; i++){
				sSupportUrl[i] = sDomain + (isEng()?"/en":"/tc") + sSupportUrl[i];
				if (sSupportUrl[i].indexOf(sUrl) > -1){
					return true;
				}
			}
			return false;
		}

        if (typeof jContent != "undefined" && isSupportPath(sSupportUrl)){
        	var sContent = jContent[lang];
        	var sUrl1 = sContent.link1;
        	var sUrl2 = sContent.link2;
        	var bMobileUrl = (typeof sUrl2 == "undefined")?true:false;
            if ($placement.length > 0){
                RELAY42ACTION.log("TopMainBanner start");
                var html = "";	
                var bDebug = jContent.debug;
                var iHeight = (typeof jContent.banner_height=="undefined")?600:jContent.banner_height;
                if(jContent.customize_html){
			        var sLang_im = isEng() ? "EN" : "TC";
			        var sLang_s = isEng() ? "E" : "C";
			        var sLang_apple_watch = isEng() ? "en" : "cn";
			        var sLangSEO = isEng() ? "en" : "tc";
			        var sLang_m = isEng() ? "en" : "tc";

					html = "<div class=\"w-100 banner-img-box\" style=\"background-color: #eee;\">"+
			                    "<div class=\"banner-bg-img h-100 hidden-md-down\" style=\"background-image:url('/IMG_V4/banner/pages/Phones_Plans_Landing/applewatch_4_450_banner_BG.jpg');\">"+
			                        "<div class=\"banner-front-img h-100\" style=\"background-image:url('/IMG_V4/banner/pages/Phones_Plans_Landing/applewatch_4_450_banner_"+sLang_im+".jpg');\" alt=\"11\">"+
			                            "<div class=\"banner-img-container\">"+
			                                "<div style=\"position:absolute;width:100%;height:100%;left:50%\">"+
			                                    "<div style=\"position:absolute;transform:translate(-50%,0);\">"+
			                                        "<img style=\"display:block;height:100%;width:auto;margin:0 auto;\" src=\"/IMG_V4/banner/pages/banner_blank_600.png\"/>"+
			                                        "<a href=\"https://shop.smartone.com/"+sLang_m+"/storefront/applewatch_series4/listing/Apple-Watch-Series-4/1/\" style=\"cursor:pointer;position:absolute;width:100%;height:100%;top:0%;left:0%;\" target=\"_self\" onClick=\"_gaq.push(['_trackEvent', 'Phones_and_Plans_"+sLangSEO+"', 'Click', 'AppleWatch4_BuyNow_TB']);\"></a>"+
			                                        "<a href=\"http://iphonesite.smartone.com/service-site/Apple-Watch/jsp/Overview.jsp?lang="+sLang_apple_watch+"\" style=\"cursor: pointer;position: absolute;width: 9.5%;height: 8.5%;bottom:35.5%;left: 68.7%;\" target=\"_blank\" onClick=\"_gaq.push(['_trackEvent', 'Phones_and_Plans_"+sLangSEO+"', 'Click', 'AppleWatch4_learnmore_TB']);\"></a>"+
			                                    "</div>"+
			                                "</div>"+
			                            "</div>"+
			                        "</div>"+
			                    "</div>"+
			                    "<div class=\"banner-bg-img h-100 hidden-lg-up\" style=\"background-image:url('/IMG_V4/banner/pages/Phones_Plans_Landing/applewatch_4_450_banner_mobBG.jpg');\">"+
			                        "<div class=\"banner-front-img h-100\" style=\"background-image:url('/IMG_V4/banner/pages/Phones_Plans_Landing/applewatch_4_450_banner_mob"+sLang_im+".jpg');\" alt=\"11\" >"+
			                            "<div style=\"position:absolute;width:100%;height:100%;left:50%\">"+
			                                "<div style=\"position:absolute;transform:translate(-50%,0);\">"+
			                                    "<img style=\"display:block;height:100%;width:auto;margin:0 auto;\" src=\"/IMG_V4/banner/pages/banner_blank_m.png\"/>"+
			                                    "<a href=\"https://shop.smartone.com/"+sLang_m+"/storefront/applewatch_series4/listing/Apple-Watch-Series-4/1/\" style=\"cursor:pointer;position:absolute;width:100%;height:100%;top:0%;left:0%;\" target=\"_self\" onClick=\"_gaq.push(['_trackEvent', 'Phones_and_Plans_"+sLangSEO+"', 'Click', 'AppleWatch4_BuyNow_TB']);\"></a>"+
			                                    "<a href=\"http://iphonesite.smartone.com/service-site/Apple-Watch/jsp/Overview.jsp?lang="+sLang_apple_watch+"\" style=\"cursor: pointer;position: absolute;width: 30%;height: 8%;bottom: 36%;left: 9%;\" target=\"_blank\"  onClick=\"_gaq.push(['_trackEvent', 'Phones_and_Plans_"+sLangSEO+"', 'Click', 'AppleWatch4_learnmore_TB']);\"></a>"+
			                                "</div>"+
			                            "</div>"+
			                        "</div>"+
			                    "</div>"+
			                "</div>";
                } else {
                	html = "<div class=\"w-100 banner-img-box\" style=\"background-color: #eee;\">"+
			                    "<div class=\"banner-bg-img h-100 hidden-md-down\" style=\"background-image:url('"+sContent.background_img+"');"+(sContent.background_style?sContent.background_style:"")+"\">"+
			                        "<div class=\"banner-front-img h-100\" style=\"background-image:url('"+sContent.foreground_img+"');"+(sContent.foreground_style?sContent.foreground_style:"")+"\" alt=\"main-banner\">"+
			                            "<div class=\"banner-img-container\">"+
			                                "<div style=\"position:absolute;width:100%;height:100%;left:50%\">"+
			                                    "<div style=\"position:absolute;transform:translate(-50%,0);height:100%;\">"+
			                                        "<img style=\"display:block;height:100%;width:auto;margin:0 auto;\" src=\"/IMG_V4/banner/pages/banner_blank_600.png\"/>";
			                                        	if (typeof sUrl1 != "undefined"){
			                                        		html += "<a href=\""+sUrl1.url+"\" style=\"cursor:pointer;position:absolute;width:100%;height:100%;top:0%;left:0%;\" target=\""+sUrl1.url_target+"\" data-r42-id=\"r42-banner-button-1\"></a>";
			                                        	}
			                                        	if (typeof sUrl2 != "undefined"){
				                                        	html += "<a href=\""+sUrl2.url+"\" class=\"banner-img-btn-2\" style=\"cursor: pointer;position: absolute;width:"+sUrl2.width+";height:"+sUrl2.height+";bottom:"+sUrl2.bottom+";left:"+sUrl2.left+";"+(bDebug?"background: #ff000082;":"")+"\" target=\""+sUrl2.url+"\" data-r42-id=\"r42-banner-button-2\"></a>";
				                                        }
			        html +=                     "</div>"+
			                                "</div>"+
			                            "</div>"+
			                        "</div>"+
			                    "</div>";
           			if (bMobileUrl){
       					html += "<a href=\""+sUrl1.url+"\" style=\"cursor:pointer;\" target=\""+sUrl1.url_target+"\" data-r42-id=\"r42-banner-button-1\">";
                    }
			        html +=     "<div class=\"banner-bg-img h-100 hidden-lg-up\" style=\"background-image:url('"+sContent.mobile_background_img+"');"+(sContent.mobile_background_style?sContent.mobile_background_style:"")+"\">"+
			                        "<div class=\"banner-front-img h-100\" style=\"background-image:url('"+sContent.mobile_foreground_img+"');"+(sContent.mobile_foreground_style?sContent.mobile_foreground_style:"")+"\" alt=\"main-banner\" >";
			                        	if (typeof sUrl1 != "undefined" && !bMobileUrl){
			                        		html += "<a href=\""+sUrl1.url+"\" style=\"cursor:pointer;position:absolute;width: 29%;height: 11%;bottom: 10%;left: 21%;\" target=\""+sUrl1.url_target+"\" data-r42-id=\"r42-banner-button-1\"></a>";
			                        	}
			                        	if (typeof sUrl2 != "undefined"){
			                        		html += "<a href=\""+sUrl2.url+"\" class=\"banner-img-btn-2--mobile\" style=\"cursor: pointer;position: absolute;width: 29%;height: 11%;bottom: 10%;left: 50%;"+(bDebug?"background: #ff000082;":"")+"\" target=\""+sUrl2.url_target+"\" data-r42-id=\"r42-banner-button-2\"></a>";
			                        	}
			        html +=     	"</div>"+
			                    "</div>";
                    if (bMobileUrl){
       					html += "</a>";
                    }
			        html +=   "</div>";
                }

                if (html!=""){
                	var $inner = $placement.find(".carousel-inner");	    
				    var $indicators = $placement.find(".carousel-indicators");	 
					var $innerItem = $inner.find(".carousel-item");
					var $indicatorsItem = $indicators.find("li");
				    var sItemClass = " b-"+iHeight;

				    if ($indicators.length == 0 && $innerItem.length==1){
				    	$indicators = jQuery("<ol class=\"carousel-indicators\" style=\"bottom:30px;\"></ol>");
				    	$indicators.prepend(jQuery("<li data-target=\"#carouselExampleControls\" data-slide-to=\"1\"></li>"));
				    	$placement.append($indicators);

				    	var carouselControl = "";
				    	carouselControl += "<a class=\"carousel-control-prev\" href=\"#carouselExampleControls\" role=\"button\" data-slide=\"prev\">";
	                    carouselControl += "    <span class=\"carousel-control-prev-icon hidden-sm-down\" aria-hidden=\"true\"></span>";
	                    carouselControl += "    <span class=\"sr-only\">Previous</span>";
	                    carouselControl += "</a>";
	                    carouselControl += "<a class=\"carousel-control-next\" href=\"#carouselExampleControls\" role=\"button\" data-slide=\"next\">";
	                    carouselControl += "    <span class=\"carousel-control-next-icon hidden-sm-down\" aria-hidden=\"true\"></span>";
	                    carouselControl += "    <span class=\"sr-only\">Next</span>";
	                    carouselControl += "</a>";
	                    $placement.append(carouselControl);
				    }

				    if ($inner.length==0){
				    	$placement.append("<div class=\"carousel-inner\" role=\"listbox\"></div>");
				    }

				    if (bDebug){
				    	$inner.html("");
				    	$indicators.html("");
				    }

				    //$inner.prepend(jQuery("<div class='carousel-item"+sItemClass+"'></div>").html(html));		
					//$indicators.prepend(jQuery("<li data-target=\"#carouselExampleControls\" data-slide-to=\"0\"></li>"));

					if (iSequence > $innerItem.length){
						// insert at the end
						iSequence = $innerItem.length - 1;
						$innerItem.eq(iSequence).after(jQuery("<div class='carousel-item"+sItemClass+"'></div>").html(html));		
						$indicatorsItem.eq(iSequence).after(jQuery("<li data-target=\"#carouselExampleControls\" data-slide-to=\"0\"></li>"));
					} else {
						$innerItem.eq(iSequence).before(jQuery("<div class='carousel-item"+sItemClass+"'></div>").html(html));		
						$indicatorsItem.eq(iSequence).before(jQuery("<li data-target=\"#carouselExampleControls\" data-slide-to=\"0\"></li>"));
					}				

					var $button1 = $placement.find("[data-r42-id='r42-banner-button-1']");
					var $button2 = $placement.find("[data-r42-id='r42-banner-button-2']");

					if ($button1.length>0){
						RELAY42ACTION.setupGaClickEvent(config, $button1);
					}
					if ($button2.length>0){
						if (typeof sUrl2.ga_page != "undefined"){
							config.ga_page = sUrl2.ga_page;
						}
						RELAY42ACTION.setupGaClickEvent(config, $button2);
					}
					
					var $indicatorItem = $indicators.find("li");
					$innerItem = $inner.find(".carousel-item");

					for (var i=0; i<$innerItem.length; i++){
						if (i==0){
							$innerItem.eq(i).addClass("active");
						} else {
							$innerItem.eq(i).removeClass("active");	
						}			
					}	

					for (var i=0; i<$indicatorItem.length; i++){
						$indicatorItem.eq(i).attr("data-slide-to", i);
						if (i==0){
							$indicatorItem.eq(i).addClass("active");
						} else {
							$indicatorItem.eq(i).removeClass("active");	
						}			
					}	
                }                			
            }
        }
        $placement.attr("data-placement-loading","");
	},
	close: function(lang, $placement){
		RELAY42ACTION.log("TopMainBanner close");
        $placement.attr("data-placement-loading","");
	}
};
// ProdTile callback
RELAY42ACTION.templateCallback.ProdTile = {
	start: function(lang, $placement, config){
		//
		var doneCallback = function(response){
			if((response||"").trim() != ""){
				try{
					var $tile = jQuery(response);
					$placement.children(".tile-inner[data-gid]").remove();
					$placement.prepend($tile);
					if(!jQuery("body").hasClass("mobile")){
						ordering.initProductTileColorChoice($tile);
						ordering.initProductTileThumbnailRollover($tile);
					}
					var $a = $tile.find("a").eq(0);
					if($a.length > 0){
						RELAY42ACTION.setupGaClickEvent(config, $a);
					}
				}catch(error){
					RELAY42ACTION.error("Fail to append product tile (" + type + ":" + gid+")");
				}
			}else{
				RELAY42ACTION.error("Fail to fetch product tile (" + type + ":" + gid+")");
			}
			/*
			try{
				console.log("response="+response);
				var json = JSON.parse(response);
				if(json && (json.status=="ok")){
					var tile = (json.tile||"").trim();
					if(tile != ""){
						$placement.children(".tile-inner[data-gid]").remove();
						var $tile = jQuery(tile);
						$placement.prepend($tile);
						if(!jQuery("body").hasClass("mobile")){
							ordering.initProductTileColorChoice($tile);
							ordering.initProductTileThumbnailRollover($tile);
						}
					}
				}else{
					
				}
			}catch(err){				
			}*/
			unloading();
		};
		var failCallback = function(){
			unloading();
		};
		var unloading = function(){
			RELAY42ACTION.unloadCmsTemplatePlacementLoading($placement);
		};
		//
		RELAY42ACTION.log("ProdTile start");
		var content = config.template.content;
		if(!content){
			RELAY42ACTION.error("Missing template content");
			return;
		}
		var gid = (content.gid||"").trim();
		if(gid == ""){
			RELAY42ACTION.error("Missing content.gid");
			return;
		}
		var type = (content.type||"").trim();
		if(type == ""){
			RELAY42ACTION.error("Missing content.type");
			return;
		}

		try{
			var l = (lang=="english") ? "/en" : "/tc" ;
			var url = l + "/storefront/ajax/get_prod_tile.jsp";
			var options = {
				url     : url,
				method  : "POST",
				data    : {					
					product_type: type,					
					gid: gid,
					compare: false
				}
			};
			var xhr = jQuery.ajax(options);
			xhr.done(function(response){
				doneCallback(response);
			}).fail(function(xhr, textStatus, errorThrown){
				failCallback(xhr, textStatus, errorThrown);
			}).always(function(){
				//alwaysCallback();
			});
		}catch(err){
			failCallback();
		}
		
	},
	close: function(lang, $placement){
		RELAY42ACTION.log("ProdTile close");
		RELAY42ACTION.unloadCmsTemplatePlacementLoading($placement);
	}
};

// StoreHeroBanner
RELAY42ACTION.templateCallback.StoreHeroBanner = {
	start: function(lang, $placement, config){
		var arrangeBanners = function($placement, config){
			if(!config){
				return;
			}
			var ad = config.ad || "";
			if(ad == ""){
				return;
			}
			var campaign = config.campaign || "";
			if(campaign == ""){
				return;
			}
			// all slides have "data-placement-campaign"
			var $slides = $placement.find("[data-role='hero-banner-slide']").filter("[data-placement-campaign]");
			$slides.each(function(){
				var $this = jQuery(this);
				var placement_campaign = ($this.attr("data-placement-campaign") || "").trim();
				if(placement_campaign == campaign){
					var placement_ad = ($this.attr("data-placement-ad") || "").trim();
					// only keep campaign banner with same "ad"
					if(placement_ad == ad){
						// keep
						RELAY42ACTION.setupGaClickEvent(config, $this);
					}else{
						$this.remove();
					}
				}else{
					// remove other campaign banners
					$this.remove();
				}
			});
		};
		//
		RELAY42ACTION.log("StoreHeroBanner start");
		//console.log("before: " + $placement.find("[data-role='hero-banner-slide']").length);
		arrangeBanners($placement, config);
		//console.log("after : " + $placement.find("[data-role='hero-banner-slide']").length);
		$placement.attr("data-resume-init", "true");
		$placement.trigger("resume_init");
	},
	close: function(lang, $placement, config){
		RELAY42ACTION.log("StoreHeroBanner close");
		//console.log("before: " + $placement.find("[data-role='hero-banner-slide']").length);
		if(config){
			// default
			var campaign = config.campaign || "";			
			var $slides = $placement.find("[data-role='hero-banner-slide']").filter("[data-placement-campaign]");
			$slides.each(function(){
				var $this = jQuery(this);
				var placement_campaign = ($this.attr("data-placement-campaign") || "").trim();
				if(placement_campaign == campaign){
					var placement_ad = ($this.attr("data-placement-ad") || "").trim();
					// only keep "default" ad
					if(placement_ad.toLowerCase() == "default"){
						// keep
						RELAY42ACTION.setupGaClickEvent(config, $this);
					}else{
						$this.remove();
					}
				}else{
					// remove other campaign banners
					$this.remove();
				}
			});
		}else{
			// timeout
			$placement.find("[data-role='hero-banner-slide']").filter("[data-placement-campaign]").remove();
		}
		//console.log("after : " + $placement.find("[data-role='hero-banner-slide']").length);
		$placement.attr("data-resume-init", "true");
		$placement.trigger("resume_init");
	}
};
// ShopCmsTypeImage callback
RELAY42ACTION.templateCallback.ShopCmsTypeImage = {
	start: function(lang, $placement, config){
		RELAY42ACTION.log("ShopCmsTypeImage start");
		var changeImg = function(callback){
			var changing = false;
			if(config && config.template && config.template.content){
				var content = RELAY42ACTION.intlNode(lang, config.template.content);
				var src = RELAY42ACTION.optString(content, bStoreMobile ? "src_m" : "src");

				if(src != ""){
					var $a = $placement.find("a").first();
					//
					var href = RELAY42ACTION.optString(content, "href");
					if(href != ""){
						$a.attr("href", href);
					}
					//
					var ga_str = RELAY42ACTION.optString(content, "ga_str");
					if(ga_str == ""){
						$a.attr("onclick", null);
					}else{
						$a.attr("onclick", "ga_promotion('"+ga_str+"')")
					}
					var $img = $a.find("img").first();
					$img.attr("src", src);
					$img.on("load", function(){
						$img.off("load");
						callback();
					});
					RELAY42ACTION.setupGaClickEvent(config, $a);
					changing = true;
				}
			}
			if(!changing){
				callback();
			}
		};
		//
		changeImg(function(){
			RELAY42ACTION.unloadCmsTemplatePlacementLoading($placement);
		});
	},
	close: function(lang, $placement){
		RELAY42ACTION.log("ShopCmsTypeImage close");
		RELAY42ACTION.unloadCmsTemplatePlacementLoading($placement);
	}
};
// CartPromo callback
RELAY42ACTION.templateCallback.CartPromo = {
	start: function(lang, $placement, config){
		RELAY42ACTION.log("CartPromo start");
		var content = RELAY42ACTION.intlNode(lang, config.template.content);
		var html = RELAY42ACTION.optString(content, "html");
		if(html != ""){
			$placement.html(html);
		}
	},
	close: function(lang, $placement, config){
		RELAY42ACTION.log("CartPromo close");
	}
};
// ShopImgSwap callback
RELAY42ACTION.templateCallback.ShopImgSwap = {
	start: function(lang, $placement, config){
		function showPlacement(){
			$placement.css({"opacity":"1"});
			$placement.hide();
			$placement.fadeIn(200);
			try {	
				renderDebug();							
				renderDebugMsg("HIT {campaign:" + config.campaign + ", ad:" + config.ad + ", placement_id:" + config.placement_id + ", template.name:" + config.template.name + "}");
			} catch (err) {
			}	
		}

		function gaEvent(config){
			RELAY42ACTION.setDimension(config);
			$button = jQuery(".retention-continue-button");			
			RELAY42ACTION.setupGaClickEvent(config, $button);
		}
		
		RELAY42ACTION.log("ShopImgSwap start");
		var content = RELAY42ACTION.intlNode(lang, config.template.content);
		var isMobile = jQuery("body").hasClass("mobile");
		var src = isMobile ? RELAY42ACTION.optString(content, "src_m") : RELAY42ACTION.optString(content, "src");
		if(src != ""){
			if($placement[0].tagName.toLowerCase() == "img"){
				//
				var loadCallback = function(){
					var title = RELAY42ACTION.optString(content, "title");
					var bgColor = RELAY42ACTION.optString(content, "bg_color");
					var bgImage = RELAY42ACTION.optString(content, "bg_image");
					var $banner = $placement.closest(".mainBanner");
					if(title != ""){
						$placement.attr("alt", title);
						$placement.attr("title", title);
					}
					$placement.off("load.ShopImgSwap");
					$placement.on("load.ShopImgSwap", function(){
						showPlacement();
					});
					$placement.attr("src", src);
					if ($banner.length > 0 && bgImage !=""){
						$banner.css("background-image", "url('" + bgImage + "')");
					} else if ($banner.length > 0 && bgColor !=""){
						$banner.css({"background":bgColor});
					}
					//
					var ga_page = RELAY42ACTION.optString(content, "ga_page");
					config.ga_page = ga_page;
					gaEvent(config);					
				};
				var errorCallback = function(){
					showPlacement();
				};
				RELAY42ACTION.testImgLoad(src, loadCallback, errorCallback);
			}
		}else{
			showPlacement();
		}
	},
	close: function(lang, $placement, config){
		RELAY42ACTION.log("ShopImgSwap close");
		$placement.css({"opacity":"1"});
		$placement.hide();
		$placement.fadeIn(200);
	}
};

// Relay42TemplateCallbackRunnerPlacements
// HomePopupBanner callback
RELAY42ACTION.templateCallback.HomePopupBanner = {
	start: function(lang, placementFunction, config){
		RELAY42ACTION.log("HomePopupBanner start");
		placementFunction();
	}
};

/////////////////////////////////////////////////////////////////////////////////////
var relay42Ad = function(config){
	if(config == null){
		RELAY42ACTION.error("config is null");
		return;
	}
	var placement_id = RELAY42ACTION.optString(config, "placement_id");
	if(placement_id == ""){
		RELAY42ACTION.error("placement_id is empty", config);
		return;
	}
	var template_name = RELAY42ACTION.optString(config.template, "name");
	if(template_name == ""){
		RELAY42ACTION.error("template.name is empty", config);
		return;
	}

	// decide to run placement callback
	var placementFunction = RELAY42ACTION.getPlacementFunction(placement_id);
	var isCallbackFunction = placementFunction != null;

	if (isCallbackFunction){
		// Add Relay42 Impression
		try {
			_st.tracking.sendEngagement('CampaignView', {'campaignview_type': 'impression', 'campaignview_name': config.campaign + "." + config.ad, 'campaignview_ts': Date.now() });
			// console.log("Impression: " + config.campaign + "." + config.ad + " " + Date.now() );
		} catch (err) {
			//console.log(err);
		}

		// process the campaign placement
		RELAY42ACTION.runTemplateFunction(config, placementFunction);
	} else {
		// find placement first
		var $placement = RELAY42ACTION.getPlacement(placement_id, template_name);
		if($placement.length == 0){
			// placement not found in current path, do nothing
			return;
		}
		// placement is found
		//RELAY42ACTION.log("relay42Ad");
		//RELAY42ACTION.log(config);

		// dont run if timeout already
		if(RELAY42ACTION.getPlacementStatus($placement) != ""){
			RELAY42ACTION.info("timeout already, skip runTemplate, status="+RELAY42ACTION.getPlacementStatus($placement)+",config.campaign="+config.campaign);
			return;
		}

		// TECH-526
		// Add Relay42 Impression
		try {
			_st.tracking.sendEngagement('CampaignView', {'campaignview_type': 'impression', 'campaignview_name': config.campaign + "." + config.ad, 'campaignview_ts': Date.now() });
			// console.log("Impression: " + config.campaign + "." + config.ad + " " + Date.now() );
		} catch (err) {
			//console.log(err);
		}
		
		// process the campaign placement
		RELAY42ACTION.runTemplate(config, $placement);
	}	
};

jQuery(document).ready(function(){
	RELAY42ACTION.adTimeoutTimer = setTimeout(function(){
		RELAY42ACTION.adTimeout();
	}, RELAY42ACTION.adTimeoutDuration);

    setTimeout(function(){
        setLoading(false);
    },1000);
}) 
