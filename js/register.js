$(document).ready(function(){

  $("#btn_register").on("click", register);
  $("#btn_reset").on("click", resetForm);
});

function register(){
  /* 0. Declare variables */
  var fName = $("#txf_fName");
  var mName = $("#txf_mName");
  var lName = $("#txf_lName");
  var email = $("#txf_email");
  var dob = $("#dtf_dob");
  var password1 = $("#txf_password");
  var password2 = $("#txf_passwordConf");

  /* 1. Sanitize fields */
  /* 2. Validate that all fields have a correct input */
  validateField('name', fName);
  validateField('middle name', mName);
  validateField('name', lName);
  validateField('email', email);
  validateField('date', dob);
  validateField('password', password1);
  validateField('password', password2);
  validateField('password conf', [password1, password2]);

  /* 3. If all fields are correct, perform the registration */
  if(!fName.hasClass("is-invalid") && !mName.hasClass("is-invalid") &&
      !lName.hasClass("is-invalid") && !email.hasClass("is-invalid") &&
      !dob.hasClass("is-invalid") && !password1.hasClass("is-invalid") &&
      !password2.hasClass("is-invalid")) {

        /* 3.1 Encapsulates the user's data into a json */
        var jsonObject = {
            "userFirstName" : fName.val(),
            "userMiddleName": mName.val(),
            "userLastName"  : lName.val(),
            "userEmail"     : email.val(),
            "userDOB"       : dob.val(),
            "userPassword"  : password1.val(),
            "action"        : "REGISTER"
        };
        /* 3.2 Sends the JSON to perform the registration in the database */
        $.ajax({
            type        : "POST",
            url         : "data/application_layer.php",
            data        : jsonObject,
            dataType    : "json",
            ContentType : "application/json",
            success: function(jsonData) {
                alert(jsonData);
                /* 4. Redirect the user to the landing page */
                window.location.replace("test.html");
            },
            error: function(errorMsg){
                alert(errorMsg.statusText);
            }
        });
  }

}

function resetForm() {
  /* 0. Declare variables */
  var fName = $("#txf_fName");
  var mName = $("#txf_mName");
  var lName = $("#txf_lName");
  var email = $("#txf_email");
  var dob = $("#dtf_dob");
  var password1 = $("#txf_password");
  var password2 = $("#txf_passwordConf");

  /* 1. Reset all variables declared */
  resetField(fName);
  resetField(mName);
  resetField(lName);
  resetField(email);
  resetField(dob);
  resetField(password1);
  resetField(password2);
}

function resetField(field) {
  var fieldType = field.attr('type');

  switch (fieldType) {
    case "text":
      field.val("");
      break;

    case "date":
      field.val("");
      break;

    case "password":
      field.val("");
      break;

    default:
  }
}
