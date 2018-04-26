<?php

	/*
			 connectionToDB: 	Tries to connect to the specified database

			 RETURN:   				null:		the application couldn't perform the connection
			 									$conn:	the connection was successful
	*/
	function connectionToDB() {
		$servername = "localhost";
		$username = "root";
		$password = "root";
		$dbname = "tlamachtli";

		$conn = new mysqli($servername, $username, $password, $dbname);
		$conn->set_charset('utf8');
		if ($conn->connect_error) {
			return null;
		} else {
			return $conn;
		}
	}

  /*
       dbRegister: 			Tries to register an user, verifying that there is no
                        other user with the same "username"

       RETURN:   				array:		 an array with the key "status", and a integer
                                   value, that indicates the error
                        $response: an array with all the data collected from the
                                   database
  */
  function dbRegister($fName, $mName, $lName, $email, $dob, $passwrd) {
    $connection = connectionToDB();
    // A successful connection
    if($connection != null) {
      // A query to look if there is a user account using that email
      $sql = "SELECT *
              FROM Users
              WHERE email = '$email'";

      $resultDB = $connection->query($sql);

      if ($resultDB->num_rows > 0) {
        // There is already a user with that email
        return array("status" => "409");
      } else {
        // The email is free to register to a new account, proceed to make the insertion
        $sql = "INSERT INTO Users(email, altEmail, passwrd, fName, mName, lName, dob)
                VALUES ('$email', NULL, '$passwrd', '$fName', '$mName', '$lName', '$dob')";

        if (mysqli_query($connection, $sql)) {
          // Retrieve the "userID" that was automatically assigned

          // The query was successful and the user data was saved in the DB
          return array("firstName"=>$fName,
                       "middleName"=>$mName,
                       "lastName"=>$lName,
                       "email"=>$email,
											 "emailAlt"=>"",
                       "dob"=>$dob,
                       "status"=>"SUCCESS");
        } else {
          // The user data couldn't be saved in the DB
          return array("status" => "500");
        }
      }
    } else {
      // Couldn't access the database
      return array("status" => "500");
    }
  }


  /*
       dbLogin: 	     Tries to connect to the specified database

       RETURN:   				array:		 an array with the key "status", and a integer
                                   value, that indicates the error
                        $response: an array with all the data collected from the
                                   database
  */
  function dbLogin($uEmail, $uPassword) {
    $connection = connectionToDB();
    // If the connection is successful
    if ($connection != null) {
      // Look for the corresponging user "email" that matches the  "password"
      $sql = "SELECT *
              FROM Users
              WHERE email = '$uEmail' AND passwrd = '$uPassword'";

      $resultDB = $connection->query($sql);

      // If there is more than 1 result, the user exists
      if ($resultDB->num_rows > 0) {
        // Capture all the information of that user
        while ($row = $resultDB->fetch_assoc()) {
          $response = array("userID"=>$row["userID"],
                            "firstName"=>$row["fName"],
                            "middleName"=>$row["mName"],
                            "lastName"=>$row["lName"],
                            "email"=>$row["email"],
														"emailAlt"=>$row["altEmail"],
                            "dob"=>$row["dob"],
                            "status"=>"SUCCESS");
        }
        // Send all the information of that user
        return $response;
      } else {
        // The user doesn't exists with the email given
        return array("status"=>"406");
      }
    } else {
      // The server coudlnt stablish a connection to the DB
      return array("status" => "500");
    }
  }

	function dbUpdateUser($fName, $mName, $lName, $oldEmail, $newEmail, $emailAlt, $dob) {
		$connection = connectionToDB();
		// A successful connection
		if($connection != null) {
			// if the user is updating its email
			if ($newEmail != "") {
				// Perform a query to know if the email is not already in use
				$sql = "SELECT *
								FROM Users
								WHERE email = '$newEmail'";
				$resultDB = $connection->query($sql);

				if ($resultDB->num_rows > 0) {
					// There is already a user with that email
					return array("status" => "409");
				} else {
					// The email is free to use, proceed to update values
					$fNameRes = dbUpdateCell("fName", $fName, $oldEmail);
					$mNameRes = dbUpdateCell("mName", $mName, $oldEmail);
					$lNameRes = dbUpdateCell("lName", $lName, $oldEmail);
					$emailAltRes = dbUpdateCell("altEmail", $emailAlt, $oldEmail);
					$dobRes = dbUpdateCell("dob", $dob, $oldEmail);
					$emailRes = dbUpdateCell("email", $newEmail, $oldEmail);

					return array("firstName" => $fNameRes,
											 "middleName"=> $mNameRes,
											 "lastName"  => $lNameRes,
											 "email"     => $emailRes,
											 "emailAlt"  => $emailAltRes,
											 "dob"       => $dobRes,
											 "status"    => "SUCCESS");

				}
			// The user is not updating its email
			} else {
				// Proceed directly to update values
				$fNameRes = dbUpdateCell("fName", $fName, $oldEmail);
				$mNameRes = dbUpdateCell("mName", $mName, $oldEmail);
				$lNameRes = dbUpdateCell("lName", $lName, $oldEmail);
				$emailAltRes = dbUpdateCell("altEmail", $emailAlt, $oldEmail);
				$dobRes = dbUpdateCell("dob", $dob, $oldEmail);

				return array("firstName" => $fNameRes,
										 "middleName"=> $mNameRes,
										 "lastName"  => $lNameRes,
										 "email"     => "EMPTY",
										 "emailAlt"  => $emailAltRes,
										 "dob"       => $dobRes,
										 "status"    => "SUCCESS");
			}
		} else {
			// Couldn't access the database
			return array("status" => "500");
		}
	}

	function dbUpdateCell($cell, $cellValue, $email) {
		$connection = connectionToDB();
		// A successful connection
		if($connection != null) {
			if($cellValue != "") {
				$sql = "UPDATE Users
								SET $cell = '$cellValue'
								WHERE email ='$email'";
				if (mysqli_query($connection, $sql)) {
					// The query was donde properly
					return $cellValue;
				} else {
					// The query couldn't be done
					return "FAILURE";
				}
			} else {
				// There is nothing to update
				return "EMPTY";
			}
		} else {
			// Couldn't stablish connection to the DB
			return "FAILURE";
		}
	}

	function db_GetAddress($uEmail) {
		$connection = connectionToDB();
    // If the connection is successful
    if ($connection != null) {
			// Look for the users real "userID" linked to the "email"  given
			$sql = "SELECT userID
              FROM Users
              WHERE email = '$uEmail'";

			$resultDB = $connection->query($sql);
			// If there is more than 1 result, the user exists
      if ($resultDB->num_rows > 0) {
        // Go through all the results
        while ($row = $resultDB->fetch_assoc()) {
					// Perform a new query to get all the users addresses
					$userID = $row["userID"];

					$sql = "SELECT *
		              FROM Address
		              WHERE userID = '$userID'";

					$resultAddressDB = $connection->query($sql);
					// Starts the response array
					$response = array();
					// Sets the first value as the "success" attribute
					$currentRow = array('status' => "SUCCESS");
					array_push($response, $currentRow);

					// Go through all the addresses obtained
	        while ($rowAddress = $resultAddressDB->fetch_assoc()) {
						// Get the current results
					  $currentRow = array("addressID"	=> $rowAddress["addressID"],
	                            	"name"			=> $rowAddress["name"],
	                            	"line1"			=> $rowAddress["line1"],
	                            	"line2"			=> $rowAddress["line2"],
	                            	"zip"				=> $rowAddress["zip"],
																"city"			=> $rowAddress["city"],
	                            	"state"			=> $rowAddress["state"],
																"country"		=> $rowAddress["country"],
																"telephone"	=> $rowAddress["telephone"],
																"deleted"		=> $rowAddress["deleted"]);
						// Add the array to the response
						array_push($response, $currentRow);
					}
					// Send the response
					return $response;
        }
			} else {
				// There is not a user linked with the email provided
				return array("status"=>"406");
			}
		} else {
			// The server coudlnt stablish a connection to the DB
			return array("status" => "500");
		}
	}

	function db_DeleteAddress($uAddressID) {
		$connection = connectionToDB();
    // If the connection is successful
    if ($connection != null) {
			$sql = "UPDATE Address
							SET deleted = 1
							WHERE addressID ='$uAddressID'";

			if (mysqli_query($connection, $sql)) {
				// The query was donde properly
				return array("status" => "SUCCESS");
			} else {
				// The query couldn't be done
				return array("status" => "FAILURE");
			}
		} else {
			// The server coudlnt stablish a connection to the DB
			return array("status" => "500");
		}
	}

	function db_AddAddress($uID, $name, $line1, $line2, $zip, $city, $state, $country, $telephone) {
    $connection = connectionToDB();
    // A successful connection
    if($connection != null) {

	    // Directly proceed to make the insertion of the
	    $sql = "INSERT INTO Address(userID, name, line1, line2, zip, city, state, country, telephone, deleted)
	            VALUES ('$uID', '$name', '$line1', '$line2', '$zip', '$city', '$state', '$country', '$telephone', 0)";

	    if (mysqli_query($connection, $sql)) {
	      // The query was successful and the new address was saved in the DB
	      return array("status"=>"SUCCESS");
	    } else {
	      // The user data couldn't be saved in the DB
	      return array("status" => "500");
	    }
    } else {
      // Couldn't access the database
      return array("status" => "500");
    }
  }

	function db_getUserID($email) {
		$connection = connectionToDB();
		// A successful connection
		if($connection != null) {
			$sql = "SELECT *
							FROM Users
							WHERE email = '$email'";

			$result = $connection->query($sql);

			while ($row = $result->fetch_assoc()) {

                return array("userID" => $row["userID"],
                    "status" => "SUCCESS");
            }

		} else {
			return array('status' => '500');
		}
	}

	function db_GetAllProducts()
	{
		$connection = connectionToDB();
		// A successful connection
		if($connection != null)
		{
			// Query to get all the products
			$sql = "SELECT *
							FROM Product";
			// Get the results from the DB
			$result = $connection->query($sql);
			// Starts the response array
			$response = array();
			$currentRow = array('status' => "SUCCESS");
			array_push($response, $currentRow);
			// Go through all the addresses obtained
			while ($row = $result->fetch_assoc())
			{
				// Get the craftsman name
				$craftName = db_GetCraftName($row["craftsmanID"]);
				$craftOrigin = db_GetCraftOrigin($row["craftsmanID"]);
				$score = db_GetScore($row["productID"]);
				// Get the current results
				$currentRow = array("productID"	  => $row["productID"],
														"craftsmanID" => $row["craftsmanID"],
														"craftsmanName"=> $craftName,
														"origin"      => $craftOrigin,
														"dateAdded"		=> $row["dateAdded"],
														"name"			  => $row["name"],
														"price"				=> $row["price"],
														"description"	=> $row["description"],
														"score"			  => $score,
														"stock"		    => $row["stock"]);
				// Add the array to the response
				array_push($response, $currentRow);
			}
			// Send the response
			return $response;
		}
		// Failed to stablish connection
		else
		{
			return array("status" => "500");
		}
	}

	function db_GetScore($prodID)
	{
		$connection = connectionToDB();
		// A successful connection
		if($connection != null)
		{
			// Query to get all the products
			$sql = "SELECT AVG(score) as Rating
							FROM Comment
							WHERE productID = '$prodID'";
			// Get the results from the DB
			$result = $connection->query($sql);
			// Go through all the addresses obtained
			while ($row = $result->fetch_assoc())
			{
					return round($row["Rating"], 2);
			}
		}
		// Failed to stablish connection
		else
		{
			return array("status" => "500");
		}
	}

	function db_GetCraftName($craftID)
	{
		$connection = connectionToDB();
		// A successful connection
		if($connection != null)
		{
			// Query to get all the products
			$sql = "SELECT anonymous, CONCAT(fName, ' ', lName) AS fullName
							FROM Craftsman
							WHERE craftsmanID = '$craftID'";
			// Get the results from the DB
			$result = $connection->query($sql);
			// Go through all the addresses obtained
			while ($row = $result->fetch_assoc())
			{
				if ($row["anonymous"] == 0)
				{
					$fullName  = $row["fullName"];
				}
				else
				{
					$fullName = "Artesano Anónimo";
				}
				return  $fullName;
			}
		}
		// Failed to stablish connection
		else
		{
			return array("status" => "500");
		}
	}

	function db_GetCraftOrigin($craftID)
	{
		$connection = connectionToDB();
		// A successful connection
		if($connection != null)
		{
			// Query to get all the products
			$sql = "SELECT city, state, country
							FROM Craftsman
							WHERE craftsmanID = '$craftID'";
			// Get the results from the DB
			$result = $connection->query($sql);
			// Go through all the addresses obtained
			while ($row = $result->fetch_assoc())
			{
				$result = array('city'    => $row["city"],
												'state'   => $row["state"],
												'country' => $row["country"]);
				return  $result;
			}
		}
		// Failed to stablish connection
		else
		{
			return array("status" => "500");
		}
	}

	function db_GetProduct($productID)
	{
		$connection = connectionToDB();
		// A successful connection
		if($connection != null)
		{
			// Query to get the product with the specified ID
			$sql = "SELECT *
							FROM Product
							WHERE productID = '$productID'";

			// Get the results from the DB
			$result = $connection->query($sql);
			// Starts the response array
			$response = array();
			$currentRow = array('status' => "SUCCESS");
			array_push($response, $currentRow);
			// Go through all the addresses obtained
			while ($row = $result->fetch_assoc())
			{
				$craftName = db_GetCraftName($row["craftsmanID"]);
				$craftOrigin = db_GetCraftOrigin($row["craftsmanID"]);
				$score = db_GetScore($row["productID"]);

				$currentRow = array('name'        => $row["name"],
														'craftsmanID' => $row["craftsmanID"],
														'craftsmanName'=> $craftName,
												    'price'       => $row["price"],
														'origin'      => $craftOrigin,
												    'description' => $row["description"],
											      "score"			  => $score,
										        'stock'       => $row["stock"]);
				array_push($response, $currentRow);
			}
			return  $response;
		}
		// Failed to stablish connection
		else
		{
			return array("status" => "500");
		}
	}

	function db_GetProductCraftsman($craftID)
	{
		$connection = connectionToDB();
		// A successful connection
		if($connection != null)
		{
			// Query to get the product with the specified craftsman ID
			$sql = "SELECT *
							FROM Product
							WHERE craftsmanID = '$craftID'";

			// Get the results from the DB
			$result = $connection->query($sql);
			// Starts the response array
			$response = array();
			$currentRow = array('status' => "SUCCESS");
			array_push($response, $currentRow);
			// Go through all the addresses obtained
			while ($row = $result->fetch_assoc())
			{
				$craftName = db_GetCraftName($row["craftsmanID"]);
				$craftOrigin = db_GetCraftOrigin($row["craftsmanID"]);
				$currentRow = array('name'        => $row["name"],
														'productID'   => $row["productID"],
														'craftsmanID' => $row["craftsmanID"],
														'craftsmanName'=> $craftName,
												    'price'       => $row["price"],
														'origin'      => $craftOrigin,
												    'description' => $row["description"],
											      'score'       => $row["score"],
										        'stock'       => $row["stock"]);
				array_push($response, $currentRow);
			}
			return  $response;
		}
		// Failed to stablish connection
		else
		{
			return array("status" => "500");
		}
	}

	function db_GetCraftsman($craftID)
	{
		$connection = connectionToDB();
		// A successful connection
		if($connection != null)
		{
			// Query to get the craftsman with the specified ID
			$sql = "SELECT *
							FROM Craftsman
							WHERE craftsmanID = '$craftID'";

			// Get the results from the DB
			$result = $connection->query($sql);
			// Go through all the addresses obtained
			while ($row = $result->fetch_assoc())
			{
				$response = array('fName'     => $row["fName"],
													'mName'     => $row["mName"],
											    'lName'     => $row["lName"],
											    'city'      => $row["city"],
										      'state'     => $row["state"],
													'country'   => $row["country"],
									        'bio'       => $row["bio"],
													'anonymous' => $row["anonymous"],
												  'status'    => "SUCCESS");
			}
			return  $response;
		}
		// Failed to stablish connection
		else
		{
			return array("status" => "500");
		}
	}

	function db_GetComments($prodID)
	{
		$connection = connectionToDB();
		// A successful connection
		if($connection != null)
		{
			// Query to get the comments from the specified product ID
			$sql = "SELECT *
							FROM Comment
							WHERE productID = '$prodID'";

			// Get the results from the DB
			$result = $connection->query($sql);
			// Starts the response array
			$response = array();
			$currentRow = array('status' => "SUCCESS");
			array_push($response, $currentRow);
			// Go through all the addresses obtained
			while ($row = $result->fetch_assoc())
			{
				$userName = db_GetUserFullname($row["userID"]);
				$currentRow = array('name'    => $userName,
														'datePub' => $row["datePub"],
														'score'   => $row["score"],
														'comment' => $row["comment"]);
				array_push($response, $currentRow);
			}
			return  $response;
		}
		// Failed to stablish connection
		else
		{
			return array("status" => "500");
		}
	}

	function db_GetUserFullname($userID)
	{
		$connection = connectionToDB();
		// A successful connection
		if($connection != null)
		{
			// Query to get the user full name from the specified user ID
			$sql = "SELECT fName, mName, lName
							FROM Users
							WHERE userID = '$userID'";
			// Get the results from the DB
			$result = $connection->query($sql);
			// Go through all the addresses obtained
			while ($row = $result->fetch_assoc())
			{

				$result = array('first' => $row["fName"],
												'middle' => $row["mName"],
												'last' => $row["lName"]);
				return  $result;
			}
		}
		// Failed to stablish connection
		else
		{
			return array("status" => "500");
		}
	}
?>
