// Facebook login code modified from https://developers.facebook.com/

// This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      login();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1012340448860771',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    status     : true,
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5' // use graph api version 2.5
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function login() {
    console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', 'get', {fields: 'id, name, email' }, function(response) {
        document.getElementById('status').innerHTML =
          'Thanks for logging in, ' + response.name + '!';
          // Checks if email is registered in our app
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() { 
              if (xhttp.readyState == 4 && xhttp.status == 200 && typeof response.email != 'undefined') {
                var xhr = new XMLHttpRequest();
                // If not, a new account is made and will direct them to edit profile
                if (xhttp.responseText == 'false') {
                  xhr.open("POST", "/users/user", true);
                  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                  xhr.send("email="+ response.email + "&password=" + response.id + "&FB=true");
                  xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                      window.location = xhr.responseText;
                    }
                  };
                }
                // If it is in our app, login the user
                else {
                  xhr.open("POST", "/users/user", true);
                  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                  xhr.send("email="+ response.email + "&password=" + response.id + "&login=true");
                  window.location = "/";
                }
              }
          }
          xhttp.open("POST", "/user/email", true);
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.send("email="+ response.email);
      });
    
  }
// Logout facebook session user
  function logout(){
    FB.logout(function(response) {
       document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
    });
  }
