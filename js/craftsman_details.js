$(document).ready(function(){
  loadCraftsmanProfile();
  loadCraftsmanWork();
  checkSession();
  $(document).on("click", ".product-image", function(event){browseProduct(event);});
  $(document).on("click", ".product-name", function(event){console.log("CLICK");browseProduct(event);});
});

function browseProduct(event) {
  /* 0. Declaration of variables */
  var target = $(event.target);
  /* 1. Capture the parent which contains the ID of the address inside its attribute */
  var productID = target.parent().parent().attr('id');
  localStorage.setItem('browsedProduct', productID);
  window.location.assign("./product_details.html");
}

function loadCraftsmanProfile() {
  /* 0. Declare variables */
  var craftsmanID = localStorage.getItem('browsedCraftsman');

  /* 1. Get from the database the specified product information */
  /* 1.1 Prepare the JSON with the command */
  var jsonToSend = {"craftsmanID"   : craftsmanID,
                    "action"        : "GET CRAFTSMAN"};
  console.log(jsonToSend);
  /* 1.2 Send the JSON to the database with AJAX */
  $.ajax({
    url 				: "./data/application_layer.php",
    type        : "POST",
    data        : jsonToSend,
    ContentType : "application/json",
    dataType    : "json",
    success     : function(dataReceived) {
      /* 2. display the data obtained from the craftsman */
      displayCraftsmanBio(dataReceived, craftsmanID);
    },
    error     : function(errorMessage) {
      console.log("Couldn't retrieve information of the craftsman");
      console.log(errorMessage);
    }
    });
}

function displayCraftsmanBio(craftsman, craftsmanID) {
  console.log(craftsman);
  /* 1. Translate the state code  from the JSON file */
  $.ajax ({
    url       : "data/state.json",
    type      : "GET",
    dataType  : "json",
    success   : function(dataReceived) {
      /* Declare variables of the HTML elements that describe the product */
      var holderPicture = $("#craftPicture").children();
      var holderCrafName = $("#craft-name");
      var holderCity = $(".craft-city");
      var holderState = $(".craft-state");
      var holderDescription = $("#craft-description");

      var state = "";
      // The craftsman has a public profile
      if(craftsman.anonymous == 0) {
        var mName = craftsman.mName;
        /* This is to avoid displaying NULL instead of an empty space */
        if (mName == null) {
          mName = "";
        }
        fullName = craftsman.fName + ' ' + mName + ' ' + craftsman.lName;

      } else {
        fullName = "Artesano Anónimo";
      }

      /* Translate the code for the state */
      for(var i = 0; i < dataReceived[0].states.length; i++) {
        if(craftsman.state == dataReceived[0].states[i].code_3) {
          state = dataReceived[0].states[i].name;
          break;
        }
      }

      /* 2. Insert the data in the divs of the document */
      holderPicture.attr('src', 'media/craftsmen/' + craftsmanID + '/' + craftsmanID + '_0.png');
      holderCrafName.text(fullName);
      holderCity.text(craftsman.city);
      holderState.text(state);
      holderDescription.text(craftsman.bio);
    },
    error     : function(errorMsg) {
      console.log(errorMsg);
    }
  });
}

function loadCraftsmanWork() {
  var craftsmanID = localStorage.getItem('browsedCraftsman');
  /* 1. Get the products from the database */
  /* 1.1 Prepare the JSON with the command */
  var jsonToSend = {"craftsmanID" : craftsmanID,
                    "action"      : "GET PRODUCTS",
                    "productType" : "CRAFTSMAN"};
  /* 1.2 Send the JSON through an AJAX */
  $.ajax({
    url 				: "./data/application_layer.php",
    type        : "POST",
    data        : jsonToSend,
    ContentType : "application/json",
    dataType    : "json",
    success     : function(dataReceived) {
    /* 2. Display the products */
      console.log(dataReceived);
      displayCraftsmanProducts(dataReceived);
    },
    error     : function(errorMessage) {
      console.log("Products couldnt be loaded");
      console.log(errorMessage);
    }
  });

}

function displayCraftsmanProducts(products) {

  $.ajax ({
    url       : "data/state.json",
    type      : "GET",
    dataType  : "json",
    success   : function(dataReceived) {
      /* Declare variables */
      var productLog = "";
      var state = "";
      var location = "";
      var city;
      var ratingStars;

      /* Iterate over all the products obtained, we start from 1 since the
      index 0 has the status of the ajax call */
      for(var i = 1; i < products.length; i++) {

        /* Translate the code for the state */
        for(var s = 0; s < dataReceived[0].states.length; s++) {
          if(products[i].origin.state == dataReceived[0].states[s].code_3) {
            state = dataReceived[0].states[s].name;
            break;
          }
        }
        city = products[i].origin.city;

        /* The address element #1 out of a set of 4. That is, the first element */
        if (i % 4 == 1) {
          productLog += '<div class="row product-row">';
        }
        ratingStars = createRatingStars(products[i].score);
        /* The rest of the HTML code that all elements share alike */
        productLog += '<div class="col-xl-3 row-eq-height">';
          productLog += '<div id="' + products[i].productID + '" class="product-block">';
            productLog += '<a href="#"><img class="img-responsive product-image" src="media/products/' + products[i].productID + '/' + products[i].productID + '_0.png"></a>';
            productLog += '<h5><a class="product-name" href="#">' + products[i].name + '</a></h5>';
            productLog += '<h6 class="' + products[i].craftsmanID + '"><a class="product-craft" href="#">' + products[i].craftsmanName + '</a></h6>';
            productLog += '<div class="product-origin">';
              productLog += '<a class="product-city" href="#">' + city + '</a>, ';
              productLog += '<a class="product-state" href="#">' + state + '</a>';
            productLog += '</div>';
            productLog += '<div>' + '$' + products[i].price + ' MXN </div>';
            productLog += '<div>' + products[i].score + ratingStars + '</div>';
          productLog += '</div>';
        productLog += '</div>';

        /* The address element #4 out of a set of 4, or the last element */
        if (i % 4 == 0 || i + 1 == products.length) {
          productLog += '</div>';
        }
      }
      // Append All data
      $("#product-list").append(productLog);

    },
    error     : function(errorMsg) {
      console.log(errorMsg);
    }
  });
}

function createRatingStars(rating) {
  var ratingLog = "";
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

  return ratingLog;
}
