$(document).ready(function(){
  loadUserData();
  checkSession();
  $("#btn_update").on("click", changeData);
  $("html").on("click", updateInputs);
  $('html').keyup(function(e) {
    if(e.keyCode == 8) updateInputs();
  });
});

function loadUserData() {
  var jsonToSend = {"action" : "CHECK SESSION"};
  /* Verifies that there is an active session */
  $.ajax({
    url 				: "./data/application_layer.php",
    type        : "POST",
    data        : jsonToSend,
    ContentType : "application/json",
    dataType    : "json",
    success     : function(dataReceived){
      console.log("DATA FROM SESSION");
      console.log(dataReceived);
      /* 0. Declare variables */
      var fName = $("#txf_fName");
      var mName = $("#txf_mName");
      var lName = $("#txf_lName");
      var email = $("#txf_email");
      var emailAlt = $("#txf_emailAlt");
      var dob = $("#dtf_dob");

      /* 1. Replace the placeholders with the value  from the database. If the
            value is an emptys string, then place the attribute -sin indicar-*/
      fName.attr("placeholder", dataReceived.fName);
      lName.attr("placeholder", dataReceived.lName);
      email.attr("placeholder", dataReceived.email);
      dob.attr("placeholder", dataReceived.dob);
      dob.val(dataReceived.dob);

      if(dataReceived.emailAlt == "") {
        emailAlt.attr("placeholder", "sin indicar");
      } else {
        emailAlt.attr("placeholder", dataReceived.emailAlt);
      }

      if(dataReceived.mName == "") {
        mName.attr("placeholder", "sin indicar");
      } else {
        mName.attr("placeholder", dataReceived.mName);
      }
		},
		error     : function(errorMessage){
			console.log(errorMessage);
		}
	});
}

function updateInputs() {
  /* 0. Declare variables */
  var fName = $("#txf_fName");
  var mName = $("#txf_mName");
  var lName = $("#txf_lName");
  var email = $("#txf_email");
  var emailAlt = $("#txf_emailAlt");
  var dob = $("#dtf_dob");

  if (fName.val() == "") {
    fName.removeClass("is-invalid");
  }

  if (mName.val() == "") {
    mName.removeClass("is-invalid");
  }

  if (lName.val() == "") {
    lName.removeClass("is-invalid");
  }

  if (email.val() == "") {
    email.removeClass("is-invalid");
  }

  if (emailAlt.val() == "") {
    emailAlt.removeClass("is-invalid");
  }
}

function changeData() {
  /* 0. Declare variables */
  var fName = $("#txf_fName");
  var mName = $("#txf_mName");
  var lName = $("#txf_lName");
  var email = $("#txf_email");
  var emailAlt = $("#txf_emailAlt");
  var dob = $("#dtf_dob");

  /* 2. If the text field is not empty. That is, the user typed something in it,
        then make a validation of the field */
  if (fName.val() != "") {
    validateField('name', fName);
  }

  if (mName.val() != "") {
    validateField('middle name', mName);
  }

  if (lName.val() != "") {
    validateField('name', lName);
  }

  if (email.val() != "") {
    validateField('email', email);
  }

  if (emailAlt.val() != "") {
    validateField('email', emailAlt);
  }

  validateField('date', dob);

  /* 3. If there is at least one valid input that isn't empty. Then modify that data*/
  if(!fName.hasClass("is-invalid") && fName.val() != "" && fName.val() != fName.attr("placeholder") ||
      !mName.hasClass("is-invalid") && mName.val() != "" && mName.val() != mName.attr("placeholder") ||
      !lName.hasClass("is-invalid") && lName.val() != "" && lName.val() != lName.attr("placeholder") ||
      !email.hasClass("is-invalid") && email.val() != "" && email.val() != email.attr("placeholder") ||
      !emailAlt.hasClass("is-invalid") && emailAlt.val() != "" && emailAlt.val() != emailAlt.attr("placeholder") ||
      !dob.hasClass("is-invalid") && dob.val() != dob.attr("placeholder") ) {
    /* 2.1 Encapsulates the username and password into a json */
    var jsonToSend = {"userFirstName" : fName.val(),
                      "userMiddleName": mName.val(),
                      "userLastName"  : lName.val(),
                      "userOldEmail"  : email.attr("placeholder"),
                      "userNewEmail"  : email.val(),
                      "userEmailAlt"  : emailAlt.val(),
                      "userDOB"       : dob.val(),
                      "action"        : "UPDATE USER"
  	};
    console.log(jsonToSend);
    /* 2.2 Search if the user exists in the database */
    $.ajax({
  		url 				: "./data/application_layer.php",
  		type        : "POST",
  		data        : jsonToSend,
  		ContentType : "application/json",
  		dataType    : "json",
  		success     : function(dataReceived){
  			window.location.replace("./settings_data.html");
        loadUserData();
        console.log(dataReceived);
  		},
  		error       : function(errorMessage){
  			alert(errorMessage.statusText);
  		}
  	});
  }
}

function validateField(validationType, field) {

  switch (validationType) {
    case 'name':
      var re = RegExp('^\\w{1,35}$');

      if (!re.test(field.val())) {
        field.addClass("is-invalid");
      } else {
        field.removeClass("is-invalid");
      }
      break;

    case 'middle name':
      var re = RegExp('^\\w{1,35}$');

      if( !re.test(field.val())) {
        // The name is too long
        field.addClass("is-invalid");
      } else {
        field.removeClass("is-invalid");
      }
      break;

    case 'email':
      var re = RegExp('.+\\@.+[\\.\\w]+');

      if (!re.test(field.val())) {
        field.addClass("is-invalid");
      } else {
        field.removeClass("is-invalid");
      }
      break;

    case 'date':
      var age = 0;

      if (field.val() != "") {
        var re = RegExp('([0-9]{4})-([0-9]{2})-([0-9]{2})');
        var userDate = re.exec(field.val());
        var currentDate = new Date();
        age = currentDate.getFullYear() - userDate[1];
      }

      if (field == null || field.val() == "") {
        // Empty date
        field.addClass("is-invalid");
      } else if (age < 18) {
        // Is underage
        field.addClass("is-invalid");
      } else {
        field.removeClass("is-invalid");
      }
      break;

    case 'password':
      var re = RegExp('[^\\s.]{8,64}');

      if (field == null || field.val() == "" || !re.test(field.val())) {
        field.addClass("is-invalid");
      } else {
        field.removeClass("is-invalid");
      }
      break;

    case 'password conf':
      // Both password fields must have a correct input
      if (!field[0].hasClass("is-invalid") &&  !field[1].hasClass("is-invalid")){

          if (field[0].val() != field[1].val()) {
            // Passwords don't mactch
            field[1].addClass("is-invalid");
          } else {
            field[1].removeClass("is-invalid");
          }
      }
      break;

    default:

  }
}
