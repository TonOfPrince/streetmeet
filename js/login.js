angular.module('sm-meetApp.login',  ['firebase', 'ngStorage'])



.controller('LoginCtrl', ["$scope",  "$firebaseAuth", "$state", "$q", "Login", "$localStorage", "$window",
  function($scope, $firebaseAuth, $state, $q, Login, $localStorage, $window) {
    $scope.currentUser =  $localStorage.currentData || null;
    $scope.currentUserId =  $localStorage.currentUser || null;
    $scope.theEvents;

    Login.getLocation();

    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
    var auth = $firebaseAuth(ref);

    // for graph api to work
    $window.fbAsyncInit = function() {
        // Executed when the SDK is loaded

        FB.init({

          /*
           The app id of the web app;
           To register a new app visit Facebook App Dashboard
           ( https://developers.facebook.com/apps/ )
          */
          appId: '737407316337748',
          /*
           Adding a Channel File improves the performance
           of the javascript SDK, by addressing issues
           with cross-domain communication in certain browsers.
          */
          channelUrl: 'app/channel.html',
          /*
           Set if you want to check the authentication status
           at the start up of the app
          */
          status: true,
          /*
           Enable cookies to allow the server to access
           the session
          */
          cookie: true,
          /* Parse XFBML */
          xfbml: true
        });
      };

      // Are you familiar to IIFE ( http://bit.ly/iifewdb ) ?

      (function(d){
        // load the Facebook javascript SDK

        var js,
        id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];

        if (d.getElementById(id)) {
          return;
        }

        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";

        ref.parentNode.insertBefore(js, ref);

      }(document));

    $scope.loginWithFacebook = function(){
      // ref.onAuth(function(authData) {
      //   var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+authData.uid+"/userInfo");
      //   ref.set(authData.facebook.cachedUserProfile, function(error) {
      //     if (error) {
      //       console.error('error setting data!');
      //     }
      //   })
      //   ref.child("display_name").set(authData.facebook.cachedUserProfile.first_name, function(error) {
      //     if (error) {
      //       console.error('error setting display name!');
      //     }
      //   })
      //   $cookieStore.put('currentUser', authData.uid );
      //   $cookieStore.put('currentToken', authData.token );
      //   $cookieStore.put('currentData', authData.facebook.cachedUserProfile );
      //   $scope.currentUser = authData.facebook.cachedUserProfile;
      //   $scope.currentUserId = authData;
      //   $state.transitionTo('map');
      // });
      // auth.$authWithOAuthRedirect("facebook",
      auth.$authWithOAuthPopup("facebook",
        {scope: "email, user_friends" }) // scope has the permissions requested
      .then(function(authData) {
        var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+authData.uid+"/userInfo");
        ref.set(authData.facebook.cachedUserProfile, function(error) {
          if (error) {
            console.error('error setting data!');
          }
        })
        ref.child("display_name").set(authData.facebook.cachedUserProfile.first_name, function(error) {
          if (error) {
            console.error('error setting display name!');
          }
        })
        $localStorage.currentUser = authData.uid;
        $localStorage.currentToken = authData.token;
        $localStorage.currentData = authData.facebook.cachedUserProfile;
        $scope.currentUser = authData.facebook.cachedUserProfile;
        $scope.currentUserId = authData;
        $state.transitionTo('map');
        var authToken = authData.facebook.accessToken;

        // access friends from facebook
        FB.api('/me/friends', {
          'access_token': authToken
        }, function(response) {
            if (!response || response.error) {
                console.log(response.error);
            } else {
              // save friends to firebase
              var friendRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+authData.uid+"/friends");
              friendRef.set(response.data);
            }
        });



      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    };

    // $scope.logout = function(){
    //   auth.$unauth();
    // }

}])

.factory('Login', function ($q, $location, $window, $rootScope, $state, $localStorage) {
  var getLocation = function() {
    // Web page
    if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
      navigator.geolocation.getCurrentPosition(geolocationCallbackQuery, errorHandler, {timeout:10000});
    } else {
      console.error("Your browser does not support the HTML5 Geolocation API");
    }
  };

  var geolocationCallbackQuery = function(location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    $localStorage.userloc = location;
  }

  var errorHandler = function(error) {
    if (error.code == 1) {
      console.error("Error: PERMISSION_DENIED: User denied access to their location");
    } else if (error.code === 2) {
      console.error("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
    } else if (error.code === 3) {
      console.error("Error: TIMEOUT: Calculating the user's location took long");
      geolocationCallbackQuery($localStorage.userloc);
    } else {
      console.error("Unexpected error code")
    }
  };
  return {
    getLocation: getLocation
  }
});
