angular.module('sm-meetApp.login',  ['firebase', 'ngCookies', 'ngStorage'])



.controller('LoginCtrl', ["$scope",  "$firebaseAuth", "$cookieStore", "$state", "$q", "Login", "$localStorage",
  function($scope, $firebaseAuth, $cookieStore, $state, $q, Login, $localStorage) {
    $scope.currentUser =  $localStorage.currentData || null;
    $scope.currentUserId =  $localStorage.currentUser || null;
    $scope.theEvents;

    Login.getLocation();

    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
    var auth = $firebaseAuth(ref);

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
        // {scope: "email, user_events, user_friends" }); // scope has the permissions requested
        {scope: "email, user_events, user_friends" }) // scope has the permissions requested
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
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    };

    $scope.logout = function(){
      auth.$unauth();
      $cookieStore.remove('currentData')
      $cookieStore.remove('currentUser')
      $cookieStore.remove('currentToken');
    }

}])

.factory('Login', function ($q, $location, $window, $rootScope, $cookieStore, $state, $localStorage) {
// .factory('Login', function ($q, $location, $window, $rootScope, $cookieStore, $state, $firebase) {
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
