<?php
	header('Content-type: application/json');
	header('Accept: application/json');
	require_once (__DIR__ . '/data_layer.php');
	ini_set('display_errors', 1);
	ini_set('log_errors', 1);
	error_reporting(E_ALL);

	/* 	Takes the action sent through the JSON, to see which procedure the
	*		application must follow
	*/
	$action = $_POST["action"];

	switch ($action)
	{
		case 'REGISTER':
			attemptRegister();
			break;

		case 'LOGIN':
			attemptLogin();
			break;

		case 'LOGOUT':
			deleteSession();
			break;

		case 'STEAL COOKIE':
			getCookie();
			break;

		case 'CHECK SESSION':
			checkSession();
			break;

		case 'UPDATE USER':
			updateUser();
			break;

		case 'LOAD ADDRESSES':
			getAddresses();
			break;

		case 'DELETE ADDRESS':
			deleteAddress();
			break;

		case 'ADD ADDRESS':
			addAddress();
			break;

		case 'GET PRODUCTS':
			getProducts();
			break;

		case 'GET CRAFTSMAN':
			getCraftsman();
			break;

		case 'GET COMMENTS':
			getComments();
			break;
	}

  /*
     attemptRegister:  	attempts to register a new user into the database
  */
  function attemptRegister() {
    $uFname = $_POST["userFirstName"];
    $uMname = $_POST["userMiddleName"];
    $uLname = $_POST["userLastName"];
    $uEmail = $_POST["userEmail"];
		$dob = $_POST["userDOB"];
    $uPasswrd = $_POST["userPassword"];

    $result = dbRegister($uFname, $uMname, $uLname, $uEmail, $dob, $uPasswrd);

    if ($result["status"] == "SUCCESS") {
      createSession($result);
      echo json_encode($result);
    } else {
      errorHandling($result["status"]);
    }
  }

	/*
			 createSession:  	Builds the session values once the user logged in
												successfully
			 -sessionArray:   an array with the values of the sessions that will be
												created.
	*/
	function createSession($sessionArray) {
		session_start();

		/* A session to store the users 'first name' */
    if (! isset($_SESSION['firstName'])) {
      $_SESSION['firstName'] = $sessionArray['firstName'];
    }

		/* A session to store the users 'middle name' */
		if (! isset($_SESSION['middleName'])) {
			if($sessionArray['middleName'] == NULL) {
				$_SESSION['middleName'] = "";
			} else {
				$_SESSION['middleName'] = $sessionArray['middleName'];;
			}
    }

		/* A session to store the users 'last name' */
    if (! isset($_SESSION['lastName'])) {
      $_SESSION['lastName'] = $sessionArray['lastName'];
    }

		/* A session to store the 'email' */
    if (! isset($_SESSION['email'])) {
      $_SESSION['email'] = $sessionArray['email'];
    }

		/* A session to store the 'alternative email' */
    if (! isset($_SESSION['emailAlt'])) {
			if($sessionArray['emailAlt'] == NULL) {
				$_SESSION['emailAlt'] = "";
			} else {
				$_SESSION['emailAlt'] = $sessionArray['emailAlt'];
			}
    }

		/* A session to store the 'date of birth' */
    if (! isset($_SESSION['dob'])) {
      $_SESSION['dob'] = $sessionArray['dob'];
    }
	}

	/*
			deleteSession:  	deletes all the sessions created to perform a good logout
	*/
	function deleteSession() {
		session_start();
		if (isset($_SESSION['firstName']) && isset($_SESSION['middleName']) &&
				isset($_SESSION['lastName']) && isset($_SESSION['email']) &&
				isset($_SESSION['emailAlt']) && isset($_SESSION['dob'])) {

			unset($_SESSION['firstName']);
			unset($_SESSION['middleName']);
			unset($_SESSION['lastName']);
			unset($_SESSION['email']);
			unset($_SESSION['emailAlt']);
			unset($_SESSION['dob']);
			session_destroy();
			echo json_encode(array('SUCCESS' => 'Session deleted'));
		} else {
			errorHandling("407");
		}
	}

	/*
			 attemptLogin:  	attempts to log in into the website by using the
												credentials given by the user.
	*/
	function attemptLogin()
	{
		/* The user's 'email' */
		$uEmail = $_POST["userEmail"];
		/* The user's 'password' */
		$uPassword = $_POST["userPassword"];
		/* The value of the checkbox  to 'remember' the user's username */
		$uRememberMe = $_POST["rememberMe"];

		$result = dbLogin($uEmail, $uPassword);

		/* There was a successful connection and the user was found in the database */
		if ($result["status"] == "SUCCESS")
		{
			createSession($result);
			bakeCookie($uRememberMe, "cookieEmail", $uEmail);
			echo json_encode($result);
		}
		else
		{
			errorHandling($result["status"]);
		}
	}

	/*
			 errorHandling:  	displays an alert message with the error
					-errorCode:   a string with the code number of the error
	*/
	function errorHandling($errorCode) {
		switch ($errorCode) {
			case '500':
				header("HTTP/1.1 500 Bad connection, portal down");
				die("The server is down, we couldn't stablish the data base connection.");
				break;
			case '406':
				header("HTTP/1.1 406 User not found.");
				die("Wrong credentials provided.");
				break;
			case '407':
				header('HTTP/1.1 407 Session not found yet.');
				die("Error trying to delete session, or trying to find it");
				break;
			case '409':
				header('HTTP/1.1 409 Conflict, email already in use please select another one');
				die("Email already in use.");
				break;

			default:
				header("HTTP/1.1 500 Bad connection, portal down");
				die("The server is down, we couldn't stablish the data base connection.");
				break;
		}
	}

	/*
					bakeCookie:  	if the user decided to remember its username, a cookie
												is created to display the username on the next login.
												The cookie expires in 20 days.
					 -remember:   the checkbox value for the 'remember me' option.
					 -cookieName: the name that the cookie will have.
					 -cookieValue: the value that the cookie will have.
	*/
	function bakeCookie($rememberMe, $cookieName, $cookieValue) {
		/* Looks if the user decided to remember its username */
		if ($rememberMe == "true")
		{
			/* Creates a cookie to remember the user for the next 5 days */
			setcookie($cookieName, $cookieValue, time() + 60*60*24*20, "/", "", 0);
		}
	}

	/*
					getCookies:  	looks if there are any cookies saved in the browser
	*/
	function getCookie() {
		$cookieName = $_POST["cookie"];
		if (isset($_COOKIE[$cookieName])) {
			echo json_encode( array($cookieName => $_COOKIE[$cookieName]) );
		}
	}

	/*
				checkSession:  	looks if there is an active session and returns the
												values of such  sessions
	*/
	function checkSession() {
		session_start();

		if (isset($_SESSION['firstName']) && isset($_SESSION['middleName']) &&
				isset($_SESSION['lastName']) && isset($_SESSION['email']) &&
				isset($_SESSION['emailAlt']) && isset($_SESSION['dob'])) {

			echo json_encode(array('email' => $_SESSION['email'],
														 'emailAlt' => $_SESSION['emailAlt'],
														 'fName' => $_SESSION['firstName'],
														 'mName' => $_SESSION['middleName'],
														 'lName' => $_SESSION['lastName'],
														 'dob' => $_SESSION['dob']));
		} else {
			errorHandling("");
		}
	}

	function updateUser() {
		$uFname = $_POST["userFirstName"];
    $uMname = $_POST["userMiddleName"];
    $uLname = $_POST["userLastName"];
    $uOldEmail = $_POST["userOldEmail"];
		$uNewEmail = $_POST["userNewEmail"];
		$uEmailAlt = $_POST["userEmailAlt"];
		$dob = $_POST["userDOB"];

		$result = dbUpdateUser($uFname, $uMname, $uLname, $uOldEmail, $uNewEmail, $uEmailAlt, $dob);

    if ($result["status"] == "SUCCESS") {
			// Rebuild the session with the new data
			updateSession($result);
      echo json_encode($result);
    } else {
      errorHandling($result["status"]);
    }

	}

	function updateSession($sessionArray) {
		/* Updates session 'first name' */
    if ($sessionArray['firstName'] != "EMPTY" && $sessionArray['firstName'] != "FAILURE") {
      $_SESSION['firstName'] = $sessionArray['firstName'];
    }

		/* Updates session 'middle name' */
		if ($sessionArray['middleName'] != "EMPTY" && $sessionArray['middleName'] != "FAILURE") {
      $_SESSION['middleName'] = $sessionArray['middleName'];
    }

		/* Updates session 'last name' */
		if ($sessionArray['lastName'] != "EMPTY" && $sessionArray['lastName'] != "FAILURE") {
      $_SESSION['lastName'] = $sessionArray['lastName'];
    }

		/* Updates session 'email' */
		if ($sessionArray['email'] != "EMPTY" && $sessionArray['email'] != "FAILURE") {
      $_SESSION['email'] = $sessionArray['email'];
    }

		/* Updates session 'alternative email' */
		if ($sessionArray['emailAlt'] != "EMPTY" && $sessionArray['emailAlt'] != "FAILURE") {
      $_SESSION['emailAlt'] = $sessionArray['emailAlt'];
    }

		/* A session to store the 'date of birth' */
		if ($sessionArray['dob'] != "EMPTY" && $sessionArray['dob'] != "FAILURE") {
      $_SESSION['dob'] = $sessionArray['dob'];
    }
	}

	function getAddresses() {
		$uEmail = $_POST["userEmail"];

    $result = db_GetAddress($uEmail);

    if ($result[0]["status"] == "SUCCESS") {
      echo json_encode($result);
    } else {
      errorHandling($result["status"]);
    }
	}

	function deleteAddress() {
		$uAddressID = $_POST["addressID"];

		$result = db_DeleteAddress($uAddressID);

		if ($result["status"] == "SUCCESS") {
			echo json_encode($result);
		} else {
			errorHandling($result["status"]);
		}
	}

	function addAddress()
	{
		// Based on the email, look for the user's real ID
		$uEmail = $_POST["userEmail"];
		$search = db_getUserID($uEmail);
		// The user ID was successfuly retrieved
		if ($search["status"] == "SUCCESS")
		{
			$userID = $search["userID"];
			$uName  = $_POST["fullName"];
			$uLine1 = $_POST["line1"];
			$uLine2 = $_POST["line2"];
			$uZip   = $_POST["zip"];
			$uCity  = $_POST["city"];
			$uState = $_POST["state"];
			$uCountry   = $_POST["country"];
			$uTelephone = $_POST["telephone"];
			// Add the address in the DB
			$result = db_AddAddress($userID, $uName, $uLine1, $uLine2, $uZip, $uCity, $uState, $uCountry, $uTelephone);
			// The address was successfuly added
			if ($result["status"] == "SUCCESS")
			{
				echo json_encode($result);

			// Something went wrong while trying to add the address to the DB
			}
			else
			{
				errorHandling($result["status"]);
			}
		// Something went wrong while trying to get the user ID
		}
		else
		{
			errorHandling($result["status"]);
		}
	}

	function getProducts()
	{
		/* Retrieve the action of what products are to be retrieved from the DB */
		$pType = $_POST["productType"];

		/* Execute the action defined by the command */
		switch ($pType)
		{
			case 'ALL':
				$result = db_GetAllProducts();
				break;

			case 'ID':
				$result = db_GetProduct($_POST["productID"]);
				break;

			case  'CRAFTSMAN':
				$result = db_GetProductCraftsman($_POST["craftsmanID"]);
				break;
		}

		/* Send back the results */
		if ($result[0]["status"] == "SUCCESS")
		{
			echo json_encode($result);
		}
		/* There was an error */
		else
		{
			errorHandling($result["status"]);
		}
	}

	function getCraftsman()
	{
		$cID = $_POST["craftsmanID"];
		$result = db_GetCraftsman($cID);

		/* Send back the results */
		if ($result["status"] == "SUCCESS")
		{
			echo json_encode($result);
		}
		/* There was an error */
		else
		{
			errorHandling($result["status"]);
		}
	}

	function getComments()
	{
		$productID = $_POST["productID"];
		$result = db_GetComments($productID);
		/* Send back the results */
		if ($result[0]["status"] == "SUCCESS")
		{
			echo json_encode($result);
		}
		/* There was an error */
		else
		{
			errorHandling($result["status"]);
		}
	}
?>
