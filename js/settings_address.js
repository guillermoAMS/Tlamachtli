$(document).ready(function(){
  loadAddresses();
  checkSession();
  //$(".nav-edit").on("click", function(event){editAddress(event);});
  //$(".nav-delete").on("click", function(event){deleteAddress(event);});
  $(document).on("click", ".nav-delete", function(event){deleteAddress(event);});
  $(document).on("click", ".nav-edit", function(event){editAddress(event);});
  $("#btn_addAddress").on("click", function () {actionAddress("ADD ADDRESS");});
});

function editAddress(event) {
  var target = $(event.target);
  var addressID = target.parent().parent().attr('id');
  console.log(addressID);
  actionAddress(addressID);
}

function deleteAddress(event) {
  /* 0. Declaration of variables */
  var target = $(event.target);
  /* 1. Capture the parent which contains the ID of the address inside its attribute */
  var addressID = target.parent().parent().attr('id');
  console.log(addressID);

  /* 2. Get the user email stored in the session */
  /* 2.1 Prepare the JSON with the command */
  var jsonToSend = {"action" : "CHECK SESSION"};
  /* 2.2 Send the JSON with an AJAX */
  $.ajax({
    url 				: "./data/application_layer.php",
    type        : "POST",
    data        : jsonToSend,
    ContentType : "application/json",
    dataType    : "json",
    success     : function(dataReceived) {
      /* 3. Modify the status of the address */
      /* 3.1 Prepare the JSON with the command */
      var jsonToSend = {"addressID" : addressID,
                        "action"    : "DELETE ADDRESS"};
      console.log(jsonToSend);
      /* 3.2 Send the JSON with an AJAX */
      $.ajax({
        url 				: "./data/application_layer.php",
        type        : "POST",
        data        : jsonToSend,
        ContentType : "application/json",
        dataType    : "json",
        success     : function(dataReceived) {
          /* 4. Reload the page to show the results */
          console.log(dataReceived);
          var addressBlock = target.parent().parent();
          // Animation to fade out the entire address block
          addressBlock.fadeOut( "slow", function() {
            location.reload();
          });
          //window.location.href = "settings_address.html";
          //window.location.replace("settings_address.html");
        },
        error     : function(errorMessage) {
          // There was an issue while trying to delete the address
          console.log("Address couldn't be deleted, please try again");
          console.log(errorMessage);
        }
      });
    },
    error     : function(errorMessage) {
      console.log("Session not started, please log in");
    }
  });
}

function loadAddresses() {
  /* 1. Request the email value fromt the session */
  var jsonToSend = {"action" : "CHECK SESSION"};
  /* Verifies that there is an active session */
  $.ajax({
    url 				: "./data/application_layer.php",
    type        : "POST",
    data        : jsonToSend,
    ContentType : "application/json",
    dataType    : "json",
    success     : function(dataReceived){
      /* 2. Reques to load the addresses from the user email */
      /* 2.1 Prepare the JSON with the commands */
      var jsonToSend = {"userEmail"  : dataReceived.email,
                        "action"     : "LOAD ADDRESSES"};
      console.log(jsonToSend);
      /* 2.2 Send the JSON with an AJAX */
      $.ajax({
        url 				: "./data/application_layer.php",
        type        : "POST",
        data        : jsonToSend,
        ContentType : "application/json",
        dataType    : "json",
        success     : function(dataReceived){
          console.log(dataReceived);
          displayAddresses(dataReceived, $("#address_list") );
    		},
    		error      : function(errorMessage) {
          console.log("The addresses couldn't be loaded");
    			console.log(errorMessage);
    		}
    	});
		},
		error     : function(errorMessage){
			console.log("Session not started, please log in");
      console.log(errorMessage);
		}
	});
}

function displayAddresses(addresses, target) {
  var addressLog = "";

  /* Iterate over all the adresses obtained, we start from 1 since the
     index 0 has the status of the ajax call */
  for(var i = 1; i < addresses.length; i++){
    /* As long as this is a direction not deleted by the user */
    if (addresses[i].deleted == "0") {
    /* The address element #1 out of a set of 3 */
    if (i % 3 == 1) {
      addressLog += '<div class="row">';
        addressLog += '<div id="'+ addresses[i].addressID +'" class="col-xl-3 row-eq-height address-block">';
          addressLog += '<h5 class="address-name">'       + addresses[i].name  + '</h5>';
          addressLog += '<div class="addres-line1">'      + addresses[i].line1 + '</div>';
          addressLog += '<div class="addres-line2">'      + addresses[i].line2 + '</div>';
          addressLog += '<div class="address-local">'     + addresses[i].city + ', ' + addresses[i].state + ' ' + addresses[i].zip + '</div>';
          addressLog += '<div class="addres-global">'     + addresses[i].country   + '</div>';
          addressLog += '<div class="address-telephone">' + addresses[i].telephone + '</div>';
          addressLog += '<br>';
          addressLog += '<nav class="bottom-nav">';
            addressLog += '<a class="nav-edit" href="#">Editar</a> | ';
            addressLog += '<a class="nav-delete" href="#">Eliminar</a>';
          addressLog += '</nav>';
        addressLog += '</div>';

    /* The address element #3 out of a set of 3, or it is the last element */
    } else  if (i % 3 == 0 || i == addresses[i].length) {
        addressLog += '<div id="'+ addresses[i].addressID +'" class="col-xl-3 offset-xl-1 row-eq-height address-block">';
          addressLog += '<h5 class="address-name">'       + addresses[i].name  + '</h5>';
          addressLog += '<div class="addres-line1">'      + addresses[i].line1 + '</div>';
          addressLog += '<div class="addres-line2">'      + addresses[i].line2 + '</div>';
          addressLog += '<div class="address-local">'     + addresses[i].city + ', ' + addresses[i].state + ' ' + addresses[i].zip + '</div>';
          addressLog += '<div class="addres-global">'     + addresses[i].country   + '</div>';
          addressLog += '<div class="address-telephone">' + addresses[i].telephone + '</div>';
          addressLog += '<br>';
          addressLog += '<nav class="bottom-nav">';
            addressLog += '<a class="nav-edit" href="#">Editar</a> | ';
            addressLog += '<a class="nav-delete" href="#">Eliminar</a>';
          addressLog += '</nav>';
        addressLog += '</div>';
      addressLog += '</div>';
      addressLog += '<br>';

    /* The address element #2 out of a set of 3 */
    } else {
      addressLog += '<div id="'+ addresses[i].addressID +'" class="col-xl-3 offset-xl-1 row-eq-height address-block">';
        addressLog += '<h5 class="address-name">'       + addresses[i].name  + '</h5>';
        addressLog += '<div class="addres-line1">'      + addresses[i].line1 + '</div>';
        addressLog += '<div class="addres-line2">'      + addresses[i].line2 + '</div>';
        addressLog += '<div class="address-local">'     + addresses[i].city + ', ' + addresses[i].state + ' ' + addresses[i].zip + '</div>';
        addressLog += '<div class="addres-global">'     + addresses[i].country   + '</div>';
        addressLog += '<div class="address-telephone">' + addresses[i].telephone + '</div>';
        addressLog += '<br>';
        addressLog += '<nav class="bottom-nav">';
          addressLog += '<a class="nav-edit" href="#">Editar</a> | ';
          addressLog += '<a class="nav-delete" href="#">Eliminar</a>';
        addressLog += '</nav>';
      addressLog += '</div>';
    }
  }
  }
  /* Append the address to the DIV that contains the addresses */
  target.append(addressLog);
}
