$(document).ready(function(){

  $("#btn_logout").on("click", logout);
});

function logout(){
  /* 0. Declare variables */

  /* 1. Communicate with the database to perform the logout */
    /* 1.1 Encapsulates the command into a json */
    var jsonObject = {"action" : "LOGOUT"};
    /* 1.2 Sends the JSON to perform the registration in the database */
    $.ajax({
        type        : "POST",
        url         : "data/application_layer.php",
        data        : jsonObject,
        dataType    : "json",
        ContentType : "application/json",
        success: function(jsonData) {
            alert(jsonData);
            alert("¡Que tenga un buen día!");
            /* 1.2.1 Redirect the user to the landing page */
            window.location.replace("login.html");
        },
        error: function(errorMsg){
            alert(errorMsg.statusText);
        }
    });
}
