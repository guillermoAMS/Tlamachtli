$(document).ready(function(){
  loadCookies();
  $("#btn_login").on("click", login);
  $("#btn_register").on("click", function() {
    window.location.assign("register.html");
  });
});

/*
        login:    validates the that the textfields are not empty, and checks in
                  the database if the user exists
*/
function login() {
  /* 0. Declare variables */
  var email = $("#txf_email");
  var password = $("#txf_password");
  var remember = $("#cbx_remember").is(":checked");

  /* 1. Validate the text entries */
  validateField('email', email);
  validateField('password', password);

  /* 2. Validates that all entries have an input */
  if (!email.hasClass("is-invalid") && !password.hasClass("is-invalid")) {
    /* 2.1 Encapsulates the username and password into a json */
    var jsonToSend = {
  						"userEmail"    : email.val(),
  						"userPassword" : password.val(),
              "rememberMe"   : remember,
              "action"       : "LOGIN"
  	};
    /* 2.2 Search if the user exists in the database */
  	$.ajax({
  		url 				: "./data/application_layer.php",
  		type        : "POST",
  		data        : jsonToSend,
  		ContentType : "application/json",
  		dataType    : "json",
  		success     : function(dataReceived){
  			//window.location.replace("test.html");
        console.log(dataReceived);
  		},
  		error       : function(errorMessage){
  			alert(errorMessage.statusText);
  		}
  	});
  }
}

/*
    loadCookies:  checks if there is a cookie saved with the specified value
    indicated in the JSON. If so, then loads the cookie text into the textfield
*/
function loadCookies() {

  var jsonToSend = {"action" : "STEAL COOKIE",
                    "cookie" : "cookieEmail"};
  /* Search if there are any cookies saved */
  $.ajax({
    url 				: "./data/application_layer.php",
    type        : "POST",
    data        : jsonToSend,
    ContentType : "application/json",
    dataType    : "json",
    success     : function(dataReceived){
      $("#txf_email").val(dataReceived.cookieEmail);
    },
    error       : function(errorMessage){
      console.log(errorMessage);
    }
  });
}
