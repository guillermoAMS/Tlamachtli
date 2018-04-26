function createRatingStars(rating) {
  ratingLog = "";
  if (rating >= 1) {
    ratingLog += '<span class="fa fa-star checked"></span>';
  } else {
    ratingLog += '<span class="fa fa-star"></span>';
  }

  if (rating >= 2) {
    ratingLog += '<span class="fa fa-star checked"></span>';
  } else {
    ratingLog += '<span class="fa fa-star"></span>';
  }

  if (rating >= 3) {
    ratingLog += '<span class="fa fa-star checked"></span>';
  } else {
    ratingLog += '<span class="fa fa-star"></span>';
  }

  if (rating >= 4) {
    ratingLog += '<span class="fa fa-star checked"></span>';
  } else {
    ratingLog += '<span class="fa fa-star"></span>';
  }

  if (rating >= 5) {
    ratingLog += '<span class="fa fa-star checked"></span>';
  } else {
    ratingLog += '<span class="fa fa-star"></span>';
  }
  return ratingLog = "";
}

function validateField(validationType, field) {

  switch (validationType) {
    case 'name':
      var re = RegExp('^\\w{1,35}$');

      if (field == null || field.val() == "" || !re.test(field.val())) {
        field.addClass("is-invalid");
      } else {
        field.removeClass("is-invalid");
      }
      break;

    case 'middle name':
      var re = RegExp('^\\w{1,35}$');
      /* Since the input is optional, it can be empty. However if it is not empty,
         then validate the field length */
      if (field.val() != "") {
        if( !re.test(field.val())) {
          // The name is too long
          field.addClass("is-invalid");
        } else {
          field.removeClass("is-invalid");
        }
      }
    break;

    case 'full name':
      var re = RegExp('^\\w{1,105}$');
      /* Since the input is optional, it can be empty. However if it is not empty,
         then validate the field length */
      if (field.val() == "" || !re.test(field.val())) {
        // The name is too long
        field.addClass("is-invalid");
      } else {
        field.removeClass("is-invalid");
      }
    break;

    case 'email':
      var re = RegExp('.+\\@.+[\\.\\w]+');

      if (field == null || field.val() == "" || !re.test(field.val())) {
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

    case 'address':
      var re = RegExp('^\\w{1,35}');

      if (field.val() == "" || !re.test(field.val())) {
        field.addClass("is-invalid");
      } else {
        field.removeClass("is-invalid");
      }
    break;

    case 'address opt':
      var re = RegExp('^\\w{1,35}$');

      if (field.val() != "") {
        if( !re.test(field.val())) {
          field.addClass("is-invalid");
        } else {
          field.removeClass("is-invalid");
        }
      }
    break;

    case 'zip':
      var re = RegExp('^\\w{5,10}$');

      if (field == null || field.val() == "" || !re.test(field.val())) {
        field.addClass("is-invalid");
      } else {
        field.removeClass("is-invalid");
      }
    break;

    case 'telephone':
      var re = RegExp('^\\d{10,20}$');

      if (field == null || field.val() == "" || !re.test(field.val())) {
        field.addClass("is-invalid");
      } else {
        field.removeClass("is-invalid");
      }
    break;

    case 'city':
      var re = RegExp('^\\D{1,35}$');

      if (field == null || field.val() == "" || !re.test(field.val())) {
        field.addClass("is-invalid");
      } else {
        field.removeClass("is-invalid");
      }
    break;

    case 'state':
      var re = RegExp('^\\D{1,35}$');

      if (field[0].val() == "" || field[0].val() == "0" || !re.test(field[0].val())) {
        field[1].addClass("is-invalid");
      } else {
        field[1].removeClass("is-invalid");
      }
    break;

    case 'country':
      var re = RegExp('^\\D{1,35}$');

      if (field[0].val() == "" || field[0].val() == "0" || !re.test(field[0].val())) {
        field[1].addClass("is-invalid");
      } else {
        field[1].removeClass("is-invalid");
      }
    break;

    default:

  }
}

function checkSession() {
  var jsonToSend = {"action" : "CHECK SESSION"};
  /* Verifies that there is an active session */
  $.ajax({
    url 				: "./data/application_layer.php",
    type        : "POST",
    data        : jsonToSend,
    ContentType : "application/json",
    dataType    : "json",
    success     : function(dataReceived){
      $("#welcomeMessage").text("Welcome back " + dataReceived.fName + "!");
		},
		error     : function(errorMessage){
			console.log(errorMessage);
		}
	});
}

function actionAddress(addressID) {
  window.location.replace("settings_address_edit.html");
  // The case where the user adds an address
  if (addressID == "ADD ADDRESS") {
    addAddress();
  // The case where the user edits an addess
  } else {
    modifyAddress(addressID);
  }
}

function addAddress() {
  console.log("User will add an address");
  /* 0. Declare variables */
  var dropmenuCountry = $("#dpm_country");
  /* 1. Load all the countries to which the shop can ship */
  loadCountries(dropmenuCountry);
}

function modifyAddress(addressID) {
  console.log("User will modify address with ID: " + addressID);
}

function loadCountries(dropDownMenu) {

  /* Get the list of countries available for shipping, in the JSON*/
  $.ajax ({
    url       : "data/country.json",
    type      : "GET",
    dataType  : "json",
    success   : function(jsonData){
      console.log(jsonData);
      var country = jsonData;
      /* Add the default option */
      var countryLog = '<option value="0">-Seleccione un país-</option>';
      dropDownMenu.append(countryLog);
      /* Iterate over all the countries available */
      for(var i = 0; i < country.length; i++) {
        /* Empty the country log so we can make a new append */
        countryLog = "";
        /* Save the country options */
        countryLog = '<option value="' + country[i].code_3 + '">' + country[i].name + '</option>';
        /* Append the country to the dropDownMenu*/
        dropDownMenu.append(countryLog);
      }

    },
    error     : function(errorMsg){
      console.log(errorMsg);
    }
  });
}
