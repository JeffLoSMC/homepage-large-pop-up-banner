var bCodeCorrect = false;
var bSystemError = false;

function VerifyCodeChecking(sField, slang){
	$(sField).value = $(sField).value.trim();

	if ($(sField).value == "") {
		if(slang=="english"){
			
			//temp use back old alert
			showcontent('Please enter the code.','','',cancelFunc,confirmFunc,slang);
			//alert("Please enter the code.");
		}else{
			
			//temp use back old alert
			showcontent('請輸入驗證碼。','','',cancelFunc,confirmFunc,slang);	
			//alert("請輸入驗證碼。");
		}	
		return false;
	} 
	if(!bCodeCorrect) {
		var livechatIcon = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-268 397.9 63 46" style="width: 28px;height: 20px;vertical-align: text-top;" xml:space="preserve"> <style type="text/css"> .st0{fill:#ff0000;stroke:#ff0000;stroke-miterlimit:10;} </style> <path class="st0" d="M-249.5,416.2c-10.2,0-18.5,6.2-18.5,13.8c0,2.8,1.1,5.5,3,7.6c1.4,1.5-0.7,4.8-1.3,6.2c4.2,0,6.5-2.3,7.7-1.8 c2.9,1.2,6,1.8,9.1,1.8c10.2,0.1,18.5-6.1,18.5-13.8C-231,422.3-239.3,416.2-249.5,416.2z M-257.8,432.8c-1.5,0-2.8-1.2-2.8-2.8 c0-1.5,1.2-2.8,2.8-2.8c1.5,0,2.8,1.2,2.8,2.8l0,0C-255,431.6-256.3,432.8-257.8,432.8z M-249.5,432.8c-1.5,0-2.8-1.2-2.8-2.8 c0-1.5,1.2-2.8,2.8-2.8c1.5,0,2.8,1.2,2.8,2.8l0,0l0,0C-246.7,431.6-248,432.8-249.5,432.8L-249.5,432.8L-249.5,432.8z M-241.2,432.8c-1.5,0-2.8-1.2-2.8-2.8c0-1.5,1.2-2.8,2.8-2.8c1.5,0,2.8,1.2,2.8,2.8l0,0C-238.4,431.6-239.6,432.8-241.2,432.8z" style="fill: #ff0000;stroke: transparent;"></path> <path class="st0" d="M-213,429.7c1.9-3.4,3.4-6.5,3.4-9.9c0-6.1-3.1-11.9-8.6-16c-5.5-3.9-12.1-6-18.8-5.9c-6.7-0.1-13.3,2-18.8,5.9 c-4.7,3.3-7.8,8.5-8.5,14.2c2-1.5,4.2-2.6,6.6-3.3c2.9-6.5,11.1-11.2,20.7-11.2c12.1,0,21.8,7.3,21.8,16.4c-0.1,2.7-0.9,5.3-2.5,7.6 c-1.6,2.5,0.8,8.2,2.5,10.1c-5.6,0-6.9-3.9-9.2-3.9c-0.4,0-0.7,0-1.1,0.2c-1.4,0.5-3.5,1.4-3.9,1.6c-1.1,2.5-2.8,4.7-4.9,6.4 c3.2-0.2,6.2-1.1,8.9-2.7c1.3-0.7,2.7,0.1,4.7,0.6c3.1,1.1,6.4,0.9,9.3-0.6C-212.3,437.7-214.7,432.7-213,429.7z" style="fill: #ff0000;stroke: transparent;"></path> </svg>';
		if (bSystemError){
			if(slang=="english"){
				//alert("The code you have entered is incorrect. Please try again.");
				//temp use back old alert
				showcontent('Oops, it looks like we cannot process your request right now.<br/>Please try again later.<br/><br/>Please feel free to contact us. We\'re here for you 24/7.<br/><a class="chatContainerToggle" href="javascript:void(0);" onclick="removeDiv();showChatContainer(true);">'+livechatIcon+' Live Chat</a> or <a href=\'https://www.smartone.com/en/privileges_and_support/contact_us/hotlines.jsp\'>Hotlines</a>','','',cancelFunc,confirmFunc,slang);
			}else{
				//alert("你輸入的驗證碼不正確，請重新輸入。");
				//temp use back old alert
				showcontent('唔好意思，我哋暫時無法處理你嘅要求…<br/>請稍後再試啦<br/><br/>歡迎你隨時聯絡我哋，我哋全天候24小時為你服務<br/><a class="chatContainerToggle" href="javascript:void(0);" onclick="removeDiv();showChatContainer(true);">'+livechatIcon+' 網上即時對話</a> 或 <a href=\'https://www.smartone.com/tc/privileges_and_support/contact_us/hotlines.jsp\'>服務熱線</a>','','',cancelFunc,confirmFunc,slang);			
			}
		}
		else{
			if(slang=="english"){
				//alert("The code you have entered is incorrect. Please try again.");
				//temp use back old alert
				//showcontent('The code you have entered is incorrect. Please try again.','','',cancelFunc,confirmFunc,slang);
				showcontent('Oops, it looks like we cannot process your request right now.<br/>Please try again later.<br/><br/>Please feel free to contact us. We\'re here for you 24/7.<br/><a class="chatContainerToggle" href="javascript:void(0);" onclick="removeDiv();showChatContainer(true);">'+livechatIcon+' Live Chat</a> or <a href=\'https://www.smartone.com/en/privileges_and_support/contact_us/hotlines.jsp\'>Hotlines</a>','','',cancelFunc,confirmFunc,slang);				
			}else{
				//alert("你輸入的驗證碼不正確，請重新輸入。");
				//temp use back old alert
				//showcontent('你輸入的驗證碼不正確，請重新輸入。','','',cancelFunc,confirmFunc,slang);			
				showcontent('唔好意思，我哋暫時無法處理你嘅要求…<br/>請稍後再試啦<br/><br/>歡迎你隨時聯絡我哋，我哋全天候24小時為你服務<br/><a class="chatContainerToggle" href="javascript:void(0);" onclick="removeDiv();showChatContainer(true);">'+livechatIcon+' 網上即時對話</a> 或 <a href=\'https://www.smartone.com/tc/privileges_and_support/contact_us/hotlines.jsp\'>服務熱線</a>','','',cancelFunc,confirmFunc,slang);							
			}
		}			
		return false;
	}
	
	return true;
}

function CheckCode(sField, sSymbolField, sS_ID) {
        //$(sField).value = $F(sField).replaceAll(" ", "");
		$(sField).observe('keypress', function(event) { keypressHandler(event, sField);});
        $(sField).observe('select', function(event) { 
			var flag=0;
			$(sField).observe('keypress', function(event) { 
				flag++;
				var key = event.which || event.keyCode;
				if(key!="undefined" && flag==1) {
					$(sField).value ="";
				}
			});
		});
		
		if ($F(sField) != "") {
				new Ajax.Request("/jsp/Internal/checkVarifyCode.jsp", {
                        method: "post",
                        parameters: { sCode: $F(sField).trim(), sID: sS_ID },
                        evalScripts: true,
                        onSuccess: function(response) {
                               bCodeCorrect = (response.responseText.trim() == "true");
							   bSystemError = (response.responseText.trim() == "systemError");
							/*
                           if (bCodeCorrect) {
                                        $(sSymbolField).innerHTML = "<img src='/common/capcha-tick.gif' />";
                                } else {
                                        $(sSymbolField).innerHTML = "<img src='/common/capcha-cross.gif' />";
                                }
							*/
                        },
                        onFailure: function(response) {
                                bCodeCorrect = false;
								bSystemError = true;
                                //$(sSymbolField).innerHTML = "<img src='/common/capcha-cross.gif' />";
                        }
                });
        }else{
		   $(sSymbolField).innerHTML = "";
		}
}


function reloadImage(sImageID, sSID, sField, sSymbolField){
            var doc = document.getElementById(sImageID);
            if(sSID==""){
			   doc.src = "/servlet/SmarTone.getGraphic" + "?d=1&act=" + (new Date());
			}else{
			  doc.src = "/servlet/SmarTone.getGraphic" + "?d=1&act=" + (new Date()) + "&s=" + sSID;
			}   
			$(sField).value = "";
			$(sSymbolField).innerHTML = "";
}


function keypressHandler (event, sField){
    var key = event.which || event.keyCode;
    
	if(key!==Event.KEY_RIGHT && key!==Event.KEY_LEFT){
	   var sValue = $(sField).value;
	   $(sField).value = sValue.replace(/ /g, '');
	}
}