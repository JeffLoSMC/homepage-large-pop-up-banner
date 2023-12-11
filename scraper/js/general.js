function GetHTMLObject(sID) {
	var obj = null;
	try {
		obj = $(sID);
	} catch (exception) {
		obj = document.getElementById(sID);
	}

	return obj;
}