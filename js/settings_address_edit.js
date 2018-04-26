$(document).ready(function(){
  loadForm();
  checkSession();
  $("#dpm_country").on("click", function() {
      var selectedCountry = $( "#dpm_country option:selected" ).val();
      loadStates($("#div_state"), selectedCountry);
    }
  );
  $("#btn_address").on("click", agregarAddress);
});
//$( "#dpm_country option:selected" ).val();
//$( "#dpm_country[name=selector]" ).val();

function loadForm() {
  var dropmenuCountry = $("#dpm_country");

  /* 1. Load all the countries to which the shop can ship */
  loadCountries(dropmenuCountry);
}

function loadCountries(dropDownMenu) {
  /* Get the list of countries available for shipping, in the JSON*/
  $.ajax ({
    url       : "data/country.json",
    type      : "GET",
    dataType  : "json",
    success   : function(jsonData){
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
      console.log("ERROR");
      console.log(errorMsg);
    }
  });
}

function loadStates(formContainer, country) {
  formContainer.empty();
  formContainer.append('<label for="dpm_state" class="control-label">Estado</label>');
  /* Get the list of countries available for shipping, in the JSON*/
  $.ajax ({
    url       : "data/state.json",
    type      : "GET",
    dataType  : "json",
    success   : function(jsonData){

      /* Get the states related to the country */
      var state;
      var stateLog = "";
      for(var i = 0; i < jsonData.length; i++) {
        if (jsonData[i].country == country) {
          state = jsonData[i].states;
        }
      }

      /* If the country was found then display the options in the dropDownMenu*/
      if (state != null) {
        /* Add the default option */
        stateLog  = '<select class="form-control" id="dpm_state">';
        stateLog += '<option value="0">-Seleccione un estado-</option>';
        /* Iterate over all the countries available */
        for(var i = 0; i < state.length; i++) {
          /* Save the country options */
          stateLog += '<option value="' + state[i].code_3 + '">' + state[i].name + '</option>';
          /* Append the country to the dropDownMenu*/
        }
        stateLog +=  '</select>';
        formContainer.append(stateLog);

      /* else the country is not in the databse yet, let the user type the state */
      } else {
        stateLog = '<input type="text" class="form-control" id="dpm_state" placeholder="">';
        formContainer.append(stateLog);
      }
    },
    error     : function(errorMsg){
      console.log("ERROR");
      console.log(errorMsg);
    }
  });
}

function agregarAddress() {
  /* 0. Declare variables */
  var name = $("#txf_name");
  var line1 = $("#txf_line1");
  var line2 = $("#txf_line2");
  var zip = $("#txf_zip");
  var telephone = $("#txf_telephone");
  var country = $( "#dpm_country option:selected" );
  var state;
  var city = $("#txf_city");
  /* 1. Retrieve all the inputs */
  /* Get the child inside the div that contains the state */
  var unknownChild = $("#div_state").children()[1];
  if(unknownChild.tagName == "SELECT") {
    state = $( "#dpm_state option:selected" );
  }

  if (unknownChild.tagName == "INPUT") {
    state = $("#dpm_state");
  }

  /* 2. Validate that the inputs are correct, if not display error message */
  validateField('full name', name);
  validateField('address', line1);
  validateField('address opt', line2);
  validateField('zip', zip);
  validateField('telephone', telephone);
  validateField('city', city);
  validateField('state', [state, $("#dpm_state")]);
  validateField('country', [country, $("#dpm_country")]);

  /* 3. If all fields are correct, add the new address */
  if(!name.hasClass("is-invalid") && !line1.hasClass("is-invalid") &&
      !line2.hasClass("is-invalid") && !zip.hasClass("is-invalid") &&
      !telephone.hasClass("is-invalid") && !city.hasClass("is-invalid") &&
      !$("#dpm_country").hasClass("is-invalid") && !$("#dpm_state").hasClass("is-invalid")) {

        var jsonToSend = {"action" : "CHECK SESSION"};
        /* Verifies that there is an active session */
        $.ajax({
          url 				: "./data/application_layer.php",
          type        : "POST",
          data        : jsonToSend,
          ContentType : "application/json",
          dataType    : "json",
          success     : function(dataReceived){

            /* 3.1 prepare the JSON with the properties and the command */
            var jsonObject = {"userEmail" : dataReceived.email,
                              "fullName"  : name.val(),
                              "line1"     : line1.val(),
                              "line2"     : line2.val(),
                              "zip"       : zip.val(),
                              "city"      : city.val(),
                              "state"     : state.val(),
                              "country"   : country.val(),
                              "telephone" : telephone.val(),
                              "action"    : "ADD ADDRESS"
            };

            /* 3.2 make an AJAX to comunicate with the database */
            $.ajax({
                type        : "POST",
                url         : "data/application_layer.php",
                data        : jsonObject,
                dataType    : "json",
                ContentType : "application/json",
                success: function(jsonData) {
                    alert(jsonData);
                    /* 4. Redirect the user to the address list page */
                    console.log(jsonObject);
                    //window.location.replace("test.html");
                },
                error: function(errorMsg){
                    console.log(jsonObject);
                }
            });
          },
          error     : function(errorMessage){
            console.log(errorMessage);
          }
        });
  }
}
