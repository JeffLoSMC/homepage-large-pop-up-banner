// by Johnson Cheung (http://www.wahon.net/~johnson/)
// Last update : April 30, 2007
// checked on
//	IE		: 5.0, 6.0*
//	Mozilla	: 1.7*
//	Netscape	: 4.78*, 7.01
//	Opera	: 7.53*, 9.20*
//	Avant	: 9.02*
//	Firefox	: 2.0.0.1*
//	Safari	: 2.0.4 (not working)

// bCookieEnable will check the browser support cookie or not
// setCookie(name, value, [expires], [path], [domain], [secure])
// getCookie(name)
// deleteCookie(name, [path], [domain])

// Summary
// - Child can get the cookies of all parent path
// - For local file, path is different in different browser, so use http server
//	IE 6.0 path setting is /C:\\Johnson\\Homepage\\global_share\\
//	Mozilla 1.7 path setting is /C:/Johnson/Homepage/global_share/

// How to set expire in 1 day
// var expires = new Date();
// expires.setTime(expires.getTime() + 86400000);

// +++ sessionless
// Set at parent, child can get if SAME session, child cannot delete
// Set at child, parent cannot get even in SAME session, parent cannot delete

// +++ Expire in 1 day
// Set at parent (path will be parent path), child can get, child cannot delete
// Set at child (path will be child path), parent cannot get, parent cannot delete

// +++ Expire in 1 day, using root path to set
// Set at parent, child can get, child can delete
// Set at child, parent can get, parent can delete



// name - name of the cookie
// value - value of the cookie
// [expires] - expiration date of the cookie (defaults to end of current session)
// [path] - path for which the cookie is valid (defaults to path of calling document)
// [domain] - domain for which the cookie is valid (defaults to domain of calling document)
// [secure] - Boolean value indicating if the cookie transmission requires a secure transmission
// * an argument defaults when it is assigned null as a placeholder
// * a null placeholder is not required for trailing omitted arguments
function setCookie(name, value, expires, path, domain, secure) {
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  document.cookie = curCookie;
}

// name - name of the desired cookie
// * return string containing value of specified cookie or null if cookie does not exist
function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else
    begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}

// name - name of the cookie
// [path] - path of the cookie (must be same as path used to create cookie)
// [domain] - domain of the cookie (must be same as domain used to create cookie)
// * path and domain default if assigned null or omitted if no explicit argument proceeds
function deleteCookie(name, path, domain) {
  if (getCookie(name)) {
    document.cookie = name + "=" +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
}

function deleteLoginCookie_ajax(targetURL) {
	new Ajax.Request('/jsp/cookie_action.jsp', {
	  method:'post',
	  onSuccess: function(response) {
	  	console.log("response.status:"+response.status);
	  },
	  onComplete: function(response) {
	  	console.log("response-complete.status:"+response.status);
			document.location.href = targetURL;
	  },
	  onFailure: function() { console.log('cookie_action Something went wrong...'); }
	});	
  // if (getCookie(name)) {
  //   document.cookie = name + "=" +
  //   ((path) ? "; path=" + path : "") +
  //   ((domain) ? "; domain=" + domain : "") +
  //   "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  // }
}

// Check the browser support cookies or not
setCookie("cokCheck", "ok", "", "/");
var bCookieEnable = (getCookie("cokCheck") != null);