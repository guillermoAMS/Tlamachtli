$(document).ready(function(){
  loadProduct();
  loadComments();
  checkSession();
  $(".craft-id").on("click", function() {
    localStorage.setItem('browsedCraftsman', $(".craft-id").attr('id'));
    window.location.assign("./craftsman_details.html");
  });
});

function loadProduct() {
  /* 0. Declare variables */
  var productID = localStorage.getItem('browsedProduct');

  /* 1. Get from the database the specified product information */
  /* 1.1 Prepare the JSON with the command */
  var jsonToSend = {"productID"   : productID,
                    "action"      : "GET PRODUCTS",
                    "productType" : "ID"};
  /* 1.2 Send the JSON to the database with AJAX */
  $.ajax({
    url 				: "./data/application_layer.php",
    type        : "POST",
    data        : jsonToSend,
    ContentType : "application/json",
    dataType    : "json",
    success     : function(dataReceived) {
      /* 2. display the data obtained from the product */
      displayProduct(dataReceived[1], productID)
    },
    error     : function(errorMessage) {
      console.log("Couldn't retrieve information of the product");
      console.log(errorMessage);
    }
    });
}

function displayProduct(product, productID) {
  /* 1. Translate the state code  from the JSON file */
  $.ajax ({
    url       : "data/state.json",
    type      : "GET",
    dataType  : "json",
    success   : function(dataReceived) {
      /* Declare variables of the HTML elements that describe the product */
      var holderPicture = $("#productPicture").children();
      var holderProdName = $("#product-name");
      var holderCrafName = $(".craft-id");
      var holderScore = $("#product-rating");
      var holderPrice = $("#product-price");
      var holderCity = $(".product-city");
      var holderState = $(".product-state");
      var holderStock = $("#product-stock");
      var holderDescription = $("#product-description");

      var state = "";
      var city = product.origin.city;
      var ratingStars;

      /* Translate the code for the state */
      for(var i = 0; i < dataReceived[0].states.length; i++) {
        if(product.origin.state == dataReceived[0].states[i].code_3) {
          state = dataReceived[0].states[i].name;
          break;
        }
      }

      ratingStars = createRatingStars(product.score);

      /* 2. Insert the data in the divs of the document */
      holderPicture.attr('src', 'media/products/' + productID + '/' + productID + '_0.png');
      holderProdName.text(product.name);
      holderCrafName.attr('id', product.craftsmanID);
      holderCrafName.text(product.craftsmanName);
      holderScore.text(product.score);
      holderScore.after(ratingStars);
      holderPrice.text('Precio: $' + product.price + ' MXN');
      holderCity.text(product.origin.city);
      holderState.text(state);
      calculateStock(holderStock, product.stock, 20);
      holderDescription.text(product.description);
    },
    error     : function(errorMsg) {
      console.log(errorMsg);
    }
  });
}

function calculateStock(holder, stock, stockWarning) {
  // No alert, we have enough products to sell
  if (stock > stockWarning) {
    holder.text('Disponible');
    holder.addClass('in-stock')
  // We are running low on stock
  } else if (0 < stock && stock <= stockWarning) {
    holder.text('Solo quedan ' + stock + ' articulos');
    holder.addClass('warning-stock');
  // No more to sell! Out of stock
  } else {
    holder.text('Fuera de stock');
    holder.addClass('out-stock')
  }
}

function loadComments() {
  /* 0. Declare variables */
  var productID = localStorage.getItem('browsedProduct');

  /* 1. Get from the database the comments from the product ID */
  /* 1.1 Prepare the JSON with the command */
  var jsonToSend = {"productID"   : productID,
                    "action"      : "GET COMMENTS"};
  /* 1.2 Send the JSON to the database with AJAX */
  $.ajax({
    url 				: "./data/application_layer.php",
    type        : "POST",
    data        : jsonToSend,
    ContentType : "application/json",
    dataType    : "json",
    success     : function(dataReceived) {
      /* 2. display the data obtained from the product */
      displayComments(dataReceived)
    },
    error     : function(errorMessage) {
      console.log("Couldn't retrieve information of the product");
      console.log(errorMessage);
    }
    });
}

function displayComments(comments) {
    var commentLog = "";
    var mName = "";
    var fullName = "";
    var date = "";
     /* Iterate over all the results */
     for (var i = 1; i < comments.length; i++) {
       commentLog = "";
       /* Makes sure that if there is no middle name, the NULL value wont be displayed */
       if(comments[i].name.middle == null) {
         mName = "";
       }

       fullName = comments[i].name.first + ' ' + mName + ' ' + comments[i].name.last;
       date = convertDate(comments[i].datePub);

       commentLog += '<div class="comment-block">'
         commentLog += '<div class="comment-name">' + fullName + '</div>'
         commentLog += '<div class="comment-date">' + date + '</div>'
         commentLog += '<div class="comment-score">' + comments[i].score + '</div>'
         commentLog += '<div class="comment">' + comments[i].comment + '</div>'
       commentLog += '</div>'
       $("#comment-list").append(commentLog);
     }
}

function convertDate(date) {
  var re = RegExp('([0-9]{4})-([0-9]{2})-([0-9]{2})');
  var userDate = re.exec(date);
  var year  = userDate[1];
  var month = userDate[2];
  var day   = userDate[3];

  month = translateMonth(month);

  return (day + ' de ' + month + ' del ' + year);
}

function translateMonth(month) {
  switch (month) {
    case '01':
      return "Enero";
    break;

    case '02':
      return "Febrero";
    break;

    case '03':
      return "Marzo";
    break;

    case '04':
      return "Abril";
    break;

    case '05':
      return "Mayo";
    break;

    case '06':
      return "Junio";
    break;

    case '07':
      return "Julio";
    break;

    case '08':
      return "Agosto";
    break;

    case '09':
      return "Septiembre";
    break;

    case '10':
      return "Octubre";
    break;

    case '11':
      return "Noviembre";
    break;

    case '12':
      return "Diciembre";
    break;

    default:
      return "Mes no registrado";
  }
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
