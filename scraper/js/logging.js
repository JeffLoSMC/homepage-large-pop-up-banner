Date.prototype.YYYYMMDDHHMMSS = function () {
	var yyyy = this.getFullYear().toString();
	var MM = pad(this.getMonth() + 1,2);
	var dd = pad(this.getDate(), 2);
	var hh = pad(this.getHours(), 2);
	var mm = pad(this.getMinutes(), 2)
	var ss = pad(this.getSeconds(), 2)

	return yyyy + MM + dd+  hh + mm + ss;
};
function pad(number, length) {
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}

	return str;
}
/*
logging.js and logging_jquery.js
*/
function WebLogging(sPageName, sPageCategory, sLang, sMobile) {
	WebLoggingParameters_v2_withDomain("", sPageName, sPageCategory, sLang, sMobile, "", "", "", "", "", "");
}
function WebLoggingParameters(sPageName, sPageCategory, sLang, sMobile, sRemark1, sRemark2, sRemark3, sRemark4, sRemark5) {
	WebLoggingParameters_v2_withDomain("", sPageName, sPageCategory, sLang, sMobile, sRemark1, sRemark2, sRemark3, sRemark4, sRemark5, "");
}
function WebLoggingParameters_v2(sPageName, sPageCategory, sLang, sMobile, sRemark1, sRemark2, sRemark3, sRemark4, sRemark5, sEmail) {
	WebLoggingParameters_v2_withDomain("", sPageName, sPageCategory, sLang, sMobile, sRemark1, sRemark2, sRemark3, sRemark4, sRemark5, sEmail);
}
function WebLoggingParameters_v2_withDomain(sDomain, sPageName, sPageCategory, sLang, sMobile, sRemark1, sRemark2, sRemark3, sRemark4, sRemark5, sEmail) {
	try {
		if (sLang == "tchinese") sLang = "tc";
		if (sLang == "english") sLang = "en";
		/*
		new Ajax.Request(sDomain + "/jsp/Internal/API_Logging.jsp", {
			method: 'post',
			parameters: {
				pt: sPageName,
				pc: sPageCategory,
				l: sLang,
				s: 'WEB-CORPWEB',
				ts: (new Date()).YYYYMMDDHHMMSS(),
				m: sMobile,
				r1: sRemark1,
				r2: sRemark2,
				r3: sRemark3,
				r4: sRemark4,
				r5: sRemark5,
				e: sEmail
			},
			onSuccess: function(response) {
			}
		});*/

		jQuery.post(sDomain + "/jsp/Internal/API_Logging.jsp", {
			pt: sPageName,
			pc: sPageCategory,
			l: sLang,
			s: 'WEB-CORPWEB',
			ts: (new Date()).YYYYMMDDHHMMSS(),
			m: sMobile,
			r1: sRemark1,
			r2: sRemark2,
			r3: sRemark3,
			r4: sRemark4,
			r5: sRemark5,
			e: sEmail
		}, function() {
			//console.log("logging ajax done");
		});
	} catch (err) {
		//console.log(err);
	}
}