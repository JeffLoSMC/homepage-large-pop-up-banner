/*
*	This file is import to below files:
*	/jsp/storefront/tmpl/storefront_html_head_v2.inc
*	/jsp/Register_ServicePlan/common/HTML_JS.inc
*/
function relay42_bProduction(){
	var hostNames = '|www.smartone.com|shop.smartone.com|care.smartone.com|';
	var host = window.location.hostname;
	if (hostNames.indexOf(host)>=0){
		return true;
	}
	else{
		return false;
	}
}

function relay42_getLanguage(sOURI){	
	try{
		if ( (sOURI.indexOf("/english/") > -1) || (sOURI.indexOf("/en/") > -1) ){
			return "english";		
		}
		else if ( (sOURI.indexOf("/tchinese/") > -1) || (sOURI.indexOf("/tc/") > -1) ){		
			return "tchinese";		
		}
		else if (sOURI.indexOf("/schinese/") > -1) {
			return "schinese";		
		}
		else{
			return "tchinese";		
		}
	}
	catch (Err){
		return "tchinese";	
	}
}

function relay42_prefix(){
	(function(a,d,e,b,f,c,s){a[b]=a[b]||function(){a[b].q.push(arguments);};
	a[b].q=[];c=d.createElement(e);c.async=1;c.src="//tdn.r42tag.com/lib/"+f+".js";
	s=d.getElementsByTagName(e)[0];s.parentNode.insertBefore(c,s);})
	(window,document,"script","_st", "1346-v1");
}

function relay42_postfix(){
	_st('loadTags');
}
/*
stepIndex: 0 | 1 | 2 | 3,
data: interface {
	productname : string;
	productprice: string;
	segment     : string;
	contract_end_date : string;
}
when stepIndex=0, no current plan data
*/
function relay42_H5GBB_retention_add_property(stepIndex, data) {
	// ignore step 0
	if(stepIndex == 0) {
		return;
	}

	if(!data) {
		console.log("relay42_H5GBB_retention_add_property: empty data");
		return;
	}
	
	var STEPS = [ "select_line", "plan", "checkout", "thankyou" ];
	if((stepIndex < 0) || (stepIndex >= STEPS.length)) {
		console.log("relay42_H5GBB_retention_add_property: invalid step " + step);
		return;
	}

	var step = STEPS[stepIndex];

	var joProperties = {};
	joProperties['brand']        = 'SmarTone H5GBB - Retention';
	joProperties['servicename']  = "retention_H5GBB";
	joProperties['step']         = step;
	joProperties['productname']  = data.productname
	joProperties['productprice'] = data.productprice
	joProperties['segment']      = data.segment;
	joProperties['contract_end_date'] = data.contract_end_date;
	joProperties['Subr_Num_h'] = data.subr_num_h;
	joProperties['Acct_Subr_Num_hs'] = data.acct_subr_hs;

	if (stepIndex > 1){
		joProperties['offerid'] = data.offerid;
	}

	try {
		_st('addTagProperties', joProperties);
		//_st('addTagProperty'  , 'Subr_Num_h', sMobile_h);
		//_st('addTagProperty'  , 'Acct_Subr_Num_hs', sAcct2001_hs);
	} catch (err) {
	}
	_st('loadTags');
	
	
	if (!relay42_bProduction()){
		console.log("relay42_H5GBB_retention_add_property step: " + step +", joProperties: "+JSON.stringify(joProperties));
		//console.log("relay42_retention_form_planinfo joInfo:"+JSON.stringify(joInfo));
	}
}

//be executed in CorpWeb_WebLogic\Register_ServicePlan\JS\retention_form_JS.js
function relay42_retention_form(uri,joInfo){		
	var DefaultPageStructure = 'Retention|Form';
	try{		
		//new Ajax.Request('https://www.smartone.com/servlet/SmarTone.Relay42', {
		new Ajax.Request('/servlet/SmarTone.Relay42', {
			method: "post",			
			parameters: { action: 'GetUriLableByUri',para: '["'+uri+'"]'},
			onSuccess: function(response) {
				var joResponse = response.responseText.evalJSON();
				if (joResponse.status === "ok"){
					var pagestructure = joResponse.result;
					if (pagestructure.indexOf(DefaultPageStructure)>=0){
						relay42_retention_form_planinfo(pagestructure,joInfo);
					}					
				}
				else{
					throw 'status fail:'+joResponse.err_msg;				
				}			
			},
			onFailure: function(response) {
				throw 'Ajax fail';				
			}
		});		
	}
	catch(err){
		if (!relay42_bProduction()){
			console.log("relay42_retention_form err:"+err);
		}		
	}	
}



function relay42_retention_form_planinfo(pagestructure,joInfo){			
	try{
		if (typeof joInfo !='object'){
			throw 'joInfo:not a object';
		}
		if (joInfo==null){
			throw 'joInfo:null';
		}
		var joProperties = {};
		var productname = joInfo.curr_plan_desc_en;
		var productprice = joInfo.curr_plan_price;
		var data = joInfo.data_entitle_en;
		if (productname!=undefined && productname!=''){
			joProperties['productname']=productname;						
		}					
		if (productprice!=undefined && productprice!=''){
			joProperties['productprice']=productprice;						
		}					
		if (data!=undefined && data!=''){
			joProperties['data']=data;						
		}					
		if (Object.keys(joProperties).length<=0){
			throw 'joProperties:empty';					
		}
		joProperties['brand']='SmarTone Mobile Plan - Retention';						
		
		joProperties['step']='enter';
		joProperties['servicename']='retention';
		
		//sample _st('addTagProperties',{"productname":"goodcare","productprice":"88","data":"Up to 384kbps","brand":"SmarTone Mobile Plan - Retention"});
		
		//relay42_prefix();
		//_st('setPageStructure', pagestructure);		
		_st('addTagProperties',joProperties);	
		
		try {
			//console.log(sMobile_h);
			_st('addTagProperty', 'Subr_Num_h', sMobile_h);
			_st('addTagProperty', 'Acct_Subr_Num_hs', sAcct2001_hs);
		} catch (err) {
		}
		
		_st('loadTags');
		//relay42_postfix();
		
		if (!relay42_bProduction()){
			console.log("relay42_retention_form_planinfo joProperties:"+JSON.stringify(joProperties));
			//console.log("relay42_retention_form_planinfo joInfo:"+JSON.stringify(joInfo));
		}
	}
	catch (err){
		if (!relay42_bProduction()){
			console.log("relay42_retention_form_planinfo err:"+err);
		}		
	}
}
//be executed in /jsp/Register_ServicePlan/english/retention_thankyou.jsp
function relay42_retention_thankyou(uri,joInfo){		
	var DefaultPageStructure = 'Retention|Thankyou';
	try{		
		//new Ajax.Request('https://www.smartone.com/servlet/SmarTone.Relay42', {
		new Ajax.Request('/servlet/SmarTone.Relay42', {
			method: "post",			
			parameters: { action: 'GetUriLableByUri',para: '["'+uri+'"]'},
			onSuccess: function(response) {
				var joResponse = response.responseText.evalJSON();
				if (joResponse.status === "ok"){
					var pagestructure = joResponse.result;
					if (pagestructure.indexOf(DefaultPageStructure)>=0){
						relay42_retention_thankyou_planinfo(pagestructure,joInfo);
					}					
				}
				else{
					throw 'status fail:'+joResponse.err_msg;				
				}			
			},
			onFailure: function(response) {
				throw 'Ajax fail';				
			}
		});		
	}
	catch(err){
		if (!relay42_bProduction()){
			console.log("relay42_retention_thankyou err:"+err);
		}		
	}	
}

function relay42_retention_thankyou_planinfo(pagestructure,joInfo){			
	try{
		if (typeof joInfo !='object'){
			throw 'joInfo:not a object';
		}
		if (joInfo==null){
			throw 'joInfo:null';
		}
		console.log("relay42_retention_thankyou_planinfo joInfo:"+joInfo);
		var productname = joInfo.plan_name;
		var productprice = joInfo.plan_fee;
		var joProperties = {};		
		if (productname!=undefined && productname!=''){			
			joProperties['productname']=productname;
		}							
		if (productprice!=undefined && productprice!=''){			
			joProperties['productprice']=productprice;
		}							
		if (Object.keys(joProperties).length<=0){
			throw 'joProperties:empty';					
		}
		joProperties['brand']='SmarTone Mobile Plan - Retention';						
		
		joProperties['step']='thankyou';
		joProperties['servicename']='retention';
		
		//sample _st('addTagProperties',{"productname":"goodcare","productprice":"88","data":"Up to 384kbps","brand":"SmarTone Mobile Plan - Retention"});
		
		//relay42_prefix();
		//_st('setPageStructure', pagestructure);		
		_st('addTagProperties',joProperties);	
		
		try {
			//console.log(sMobile_h);
			_st('addTagProperty', 'Subr_Num_h', sMobile_h);
			_st('addTagProperty', 'Acct_Subr_Num_hs', sAcct2001_hs);
		} catch (err) {
		}
		
		_st('loadTags');
		//relay42_postfix();
		
		if (!relay42_bProduction()){
			console.log("relay42_retention_thankyou_planinfo joProperties:"+JSON.stringify(joProperties));
			//console.log("relay42_retention_thankyou_planinfo joInfo:"+JSON.stringify(joInfo));
		}
	}
	catch (err){
		if (!relay42_bProduction()){
			console.log("relay42_retention_thankyou_planinfo err:"+err);
		}		
	}
}