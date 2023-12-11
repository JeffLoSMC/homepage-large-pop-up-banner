function openChat2(sDomain, sSkill, sSrc, bProactive, dummy) {
	try {
		if (sSkill.indexOf("_E") > -1) {
			_gaq.push(['_trackEvent', 'button', 'clicked', 'Corpweb Live Chat EN']);
			window.open("/en/privileges_and_support/contact_us/live_chat.jsp");	
		} else {
			_gaq.push(['_trackEvent', 'button', 'clicked', 'Corpweb Live Chat TC']);
			window.open("/tc/privileges_and_support/contact_us/live_chat.jsp");	
		}
	} catch(err) { 
	}
}