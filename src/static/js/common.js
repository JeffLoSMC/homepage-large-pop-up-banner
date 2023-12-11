// Put this file at Search Engine Server also
var sKeywordMap = {
	0: {0: "in", 1:"\"SmarTone iN!\""},
	1: {0: "in!", 1:"\"SmarTone iN!\""},
	2: {0: "smartone in", 1:"\"SmarTone iN!\""},
	3: {0: "smartone in!", 1:"\"SmarTone iN!\""},
	4: {0: "goodtalk", 1:"\"good talk\""},
	5: {0: "Goodtalk", 1:"\"good talk\""},
	6: {0: "easypay", 1:"EzPay"},
	7: {0: "easy pay", 1:"EzPay"},
	8: {0: "priority", 1:"PriorityPlus"},
	9: {0: "priority plus", 1:"PriorityPlus"}
};

var wcsrc = "";

function SubmitSearchForm() {
	$('query').value = $('query').value.trim();
	if ($('query').value == "") return false;

	// +++++
	// Keyword Mapping
	var sLowerQuery = $('query').value.toLowerCase();
	for (var iID in sKeywordMap) {
		if (sLowerQuery == sKeywordMap[iID][0]) {
			$('query').value = sKeywordMap[iID][1];
			break;
		}
	}
	
	// +++++
	return true;
}

/* Perform SEO on Naming */
function SEOString(sIn) {
	var sOut = sIn.replace(/\+/g, "plus");
	
	sOut = sOut.replace(/ /g, "-");
	sOut = sOut.replace(/[^-a-zA-Z0-9]/g, "");
	
	return sOut;
}

// EDIT MO
// Change language
/*function ChangeLang() {
	var sQueryString = top.document.location.search;

	var sNewQuery = "";
	if (sQueryString != "") {
		sQueryString = sQueryString.substring(1);
		var arySQuery = sQueryString.split("&");
		for (i=0;i<arySQuery.length;i++) {
			var arySField = arySQuery[i].split("=");
			if (arySField[0] != "") {
				if (sNewQuery == "") sNewQuery += "?";
				else sNewQuery += "&";
				sNewQuery += encodeURIComponent(arySField[0]) + "=" + encodeURIComponent(arySField[1]);
			}
		}
	}
	
	var sCurHash = top.document.location.hash;
	
	var sNewHash = "";
	if (sCurHash != "") {
		sNewHash = "#" + encodeURIComponent(sCurHash.substring(1));
	}
	
	var sTopPath = top.document.location.pathname + sNewQuery + sNewHash;

	if ( (sTopPath.indexOf("/english/") > -1) || (sTopPath.indexOf("/en/") > -1) ) {
		sTopPath = sTopPath.replace("/english/", "/tchinese/").replace("/en/", "/tc/");
	} else {
		sTopPath = sTopPath.replace("/tchinese/", "/english/").replace("/tc/", "/en/");
	}

	sTopPath = sTopPath.replace("#cloud_storage", "");

	top.location.href = sTopPath;
}*/
/*
For Remark Show & Hide
*/
function ShowHideRemark(sID) {
	if (arguments.length == 2) {
		sID = arguments[1];
		if ($(sID).style.display == "none") {
			$(sID).style.display = "block";
		} else {
			$(sID).style.display = "none";
		}
	} else if (arguments.length == 1) {
		sID = arguments[0];
		if ($(sID).readAttribute("showing") == "true") {
			$(sID).addClassName('remarkset_notshow');
			$(sID).removeClassName('remarkset_show');
			$(sID).writeAttribute("showing", "false");
			
			if ($(sID + "_arrow")) {
				$(sID + "_arrow").src = "/common/arrow_red.gif";
			}
		} else {
			$(sID).addClassName('remarkset_show');
			$(sID).removeClassName('remarkset_notshow');
			$(sID).writeAttribute("showing", "true");
			
			if ($(sID + "_arrow")) {
				$(sID + "_arrow").src = "/common/arrow_red_down.gif";
			}
		}
	}
}
// EDIT MO END
/*
function ShowHideRemark(sID) {
	if ($(sID).readAttribute("showing") == "true") {
		$(sID).addClassName('remarkset_notshow');
		$(sID).removeClassName('remarkset_show');
		$(sID).writeAttribute("showing", "false");
		
		if ($(sID + "_arrow")) {
			$(sID + "_arrow").src = "/common/arrow_red.gif";
		}
	} else {
		$(sID).addClassName('remarkset_show');
		$(sID).removeClassName('remarkset_notshow');
		$(sID).writeAttribute("showing", "true");
		
		if ($(sID + "_arrow")) {
			$(sID + "_arrow").src = "/common/arrow_red_down.gif";
		}
	}
}*/
/*
function ShowHideRemark(sID) {
	if (! $(sID).bAnimating) {
		$(sID).bAnimating = "true";
		
		if ($(sID).readAttribute("showing") == "true") {
			Effect.SlideUp(sID, {
				duration: 0.5,
				afterFinish: function() {
					$(sID).bAnimating = "";
					$(sID).writeAttribute("showing", "false");
				}
			});
		} else {
			Effect.SlideDown(sID, {
				duration: 0.5,
				afterFinish: function() {
					$(sID).bAnimating = "";
					$(sID).writeAttribute("showing", "true");
				}
			});
		}
	}
}
*/

/*
For SMC Arrow
*/
function ShowHideSMCArrow(sID, sNormal, sOver) {
	if ($(sID).readAttribute("showing") == "true") {
		$(sID).writeAttribute("showing", "false");
		
		if ($("arrow_" + sID)) {
			$("arrow_" + sID).src = sNormal;
		}
	} else {
		$(sID).writeAttribute("showing", "true");
		
		if ($("arrow_" + sID)) {
			$("arrow_" + sID).src = sOver;
		}
	}
}

function CancelClick() {
	event.cancelBubble=true;
}

function ShowTipsBox(sHTML, iWidth) {
	Tip("<div style='width: " + iWidth + "px;' id='tipsbox'><div align='right' style='margin-bottom:5px;'><img src='/common/btn_tips_close.gif' border='0' /></div>" + sHTML + "</div>", BGCOLOR, "#ffffff", BORDERCOLOR, "#ffffff",DELAY ,0,JUMPVERT,true,CENTERMOUSE,false, CLICKCLOSE, true, CLOSEBTN, false, STICKY, true, TITLEBGCOLOR, "#999999", TITLE, "", CLOSEBTNCOLORS, ["#999999", "#000000", "#999999", "#ffffff"]);
}

function OpenParent(sURL) {
		var mynewwin=window.open(sURL,"mainWin","toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes");
		mynewwin.focus();	
	/*
	try {
		if (!window.opener || window.opener.closed){
			var mynewwin=window.open(sURL,"mainWin");
			mynewwin.focus();		
		}else{	
			window.opener.location=sURL;
			window.opener.focus();	
		}		
	} catch (error) {
		var mynewwin=window.open(sURL,"mainWin","toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes");
		mynewwin.focus();	
	}
	*/
}

function fadeIn(el, display){
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
		//console.log("opacity",val);
		setTimeout(function() {
			el.style.opacity = val;			
		}, 40);
		requestAnimationFrame(fade);
    }
  })();
}

function fallingDown(el){
  el.style.top = '0.1%';  

  (function fallingDown() {	  
    var val = parseInt(el.style.top);
    if (!((val += 20) > 600)) {
		console.log("top1",val);
		setTimeout(function() {
			console.log("top2",val);
			el.style.top = val;			
		}, 100);
		
			fallingDown();
		
		requestAnimationFrame(fallingDown);
    }
  })();
}


function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 20);
}

function global_init() {
	/*--SmartAd animation--*/
	if(document.getElementById('smartad')){	
		/*
		document.getElementsByTagName('body')[0].style.position="fixed";
		document.getElementsByTagName('body')[0].style.left="20px";		
		Effect.SlideDown('smartad', { duration: 0.5, delay: 2});
		setTimeout(function() {
			document.getElementsByTagName('body')[0].style.position="inherit";
			document.getElementsByTagName('body')[0].style.left="auto";
		}, 2000);
		*/
		/*
		setTimeout(function() {			
			$('smart_loading').hide();
			fadeIn(document.getElementById('Container_Site'));
		}, 1000);
		*/
		fadeIn(document.getElementById('smartad'));
		//fallingDown(document.getElementById('smartad'));
	}
}

function Call(bCanMakePhoneCall){
/*
		if(bCanMakePhoneCall=="true"){       
			
			var Allfather=$$("PhoneNumber");
			Allfather.each(function(e){
				
				var str='<a href="tel:'+$(e).innerHTML.replace(/\s/g,'')+'">'+$(e).innerHTML+'</a>';
				$(e).update(str);
			});
		}
		*/
		
		
		if(bCanMakePhoneCall=="true"){       
			
			var AllPhoneNum=new Array();
			var Allchild=new Array();
			var Allfather=document.getElementsByClassName("PhoneNumber");
			for(var i=0;i<Allfather.length;i++){
				AllPhoneNum[i]=Allfather.item(i).innerHTML;
				Allchild[i]=document.createElement("a");
				Allchild[i].innerHTML=AllPhoneNum[i];
				Allchild[i].setAttribute("href","tel:"+AllPhoneNum[i].replace(/\s/g,'').replace('+','').replace('(','').replace(')','').replace('-',''));
				Allfather.item(i).innerHTML="";
				Allfather.item(i).appendChild(Allchild[i]);
			}
		}
	} 

function changeWebsite(){
	
	var website=document.getElementById("website").value+"";
	if(website=="Macau_en"){
		window.location.href="http://www.smartone.com/mo/en/?s=0818193a7016223f7214777f6946";
	}
		if(website=="Macau_tc"){
		window.location.href="http://www.smartone.com/mo/tc/?s=0818193a7016223f7214777f6946";
	}
}

// Detect device orientation on mobile tt=4
function detectOrientation() {	
	switch(window.orientation) {  
		case -90:
		case 90:
			toggleLandscapeTipBox(false);
		break; 
		case 0:
		case 180:
			toggleLandscapeTipBox(true);
		break; 
	}
}

function toggleLandscapeTipBox(bOpen) {
	if (!bShowLandscapeTipBox) return;
	if (bOpen) {
		new Effect.SlideDown("mobile_landscape_tipbox",{
			delay: 1,
			duration:0.3
		});
	} else {
		new Effect.SlideUp("mobile_landscape_tipbox",{
			delay: 0.2,
			duration:0.3
		});
	}
}

function setDisplayLandscapeTipBox(bOn) {
	bShowLandscapeTipBox = bOn;
}

function initLandscapeTipBox() {
	window.addEventListener('orientationchange', detectOrientation);
	bShowLandscapeTipBox = true;
	detectOrientation();
}

function includeChatbotModule(src) {
	try{
  	var z, i, elmnt, file, xhttp;
  	wcsrc = src;
    z = document.getElementById("LivePerson-wrapper");
    if(z == null || typeof(z) == "undefined") {
    	return;
    }
	file = z.getAttribute("chatbot-module-include-html");
	if (file) {
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4) {
	    if (this.status == 200) {z.innerHTML = this.responseText;}          
	    z.removeAttribute("chatbot-module-include-html");
	  }

	  if (xhttp.readyState === XMLHttpRequest.DONE) {	  	  
		var cb_module_init_script = document.createElement("script");
		cb_module_init_script.type = 'text/javascript';
		cb_module_init_script.async = true;
		document.getElementsByTagName('head')[0].appendChild(cb_module_init_script);              
		if (window.location.hostname.indexOf('webstage7a') > -1 || window.location.hostname.indexOf('ipstage8') > -1 || window.location.hostname.indexOf('myaccountuat') > -1 || window.location.hostname.indexOf('azmagappuat') > -1) {
			cb_module_init_script.src = 'https://webstage7a.smartone.com/JS_V3/chatbot/chatbot_common.js?20210803a';
		} else {
			cb_module_init_script.src = 'https://www.smartone.com/JS_V3/chatbot/chatbot_common.js?20210803a';
		}
		xhttp.abort();
	  }	  
	}
	xhttp.open("POST", file, true);
	xhttp.send();
	/* Exit the function: */
	return;
	}
	}catch(err){
		console.log("includeChatbotModule error")
		console.error(err);
	}
}
