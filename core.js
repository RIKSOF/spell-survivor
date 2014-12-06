// JavaScript Document

function getSession() {
	
	var session = "";
	
	if ( sessionStorage.getItem("userId") != null ) {
		session = sessionStorage.getItem("userId");
	} else {
		session = getRendom();
		sessionStorage.setItem("userId",session);
	}
	
	return session;
}