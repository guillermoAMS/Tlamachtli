$(document).ready(function(){
  checkSession();
  loadProducts();
  $(document).on("click", ".product-image", function(event){browseProduct(event);});
  $(document).on("click", ".product-name", function(event){browseProduct(event);});
  $(document).on("click", ".product-craft", function(event){browseCraftsman(event);});
});

function browseProduct(event) {
  /* 0. Declaration of variables */
  var target = $(event.target);
  /* 1. Capture the parent which contains the ID of the address inside its attribute */
  var productID = target.parent().parent().attr('id');
  localStorage.setItem('browsedProduct', productID);
  window.location.assign("./product_details.html");
}

function browseCraftsman(event) {
  /* 0. Declaration of variables */
  var target = $(event.target);
  /* 1. Capture the parent which contains the ID of the address inside its attribute */
  var craftsmanID = target.parent().attr('class');

  localStorage.setItem('browsedCraftsman', craftsmanID);
  console.log(localStorage.getItem('browsedCraftsman'));
  window.location.assign("./craftsman_details.html");

}

function loadProducts() {
  /* 1. Get the products from the database */
  /* 1.1 Prepare the JSON with the command */
  var jsonToSend = {"action"      : "GET PRODUCTS",
                    "productType" : "ALL"};
  /* 1.2 Send the JSON through an AJAX */
  $.ajax({
    url 				: "./data/application_layer.php",
    type        : "POST",
    data        : jsonToSend,
    ContentType : "application/json",
    dataType    : "json",
    success     : function(dataReceived) {
    /* 2. Display the products */
      displayProducts(dataReceived);
    },
    error     : function(errorMessage) {
      console.log("Products couldnt be loaded");
      console.log(errorMessage);
    }
  });
}

function displayProducts(products) {

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

      ratingStars = createRatingStars(5);
      console.log(ratingStars);

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
        //location = products[i].origin.city + ', ' + state;
        city = products[i].origin.city;

        /* The address element #1 out of a set of 4. That is, the first element */
        if (i % 4 == 1) {
          productLog += '<div class="row product-row">';
        }
        ratingStars = createRatingStars(products[i].score);
        console.log(ratingStars);
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
