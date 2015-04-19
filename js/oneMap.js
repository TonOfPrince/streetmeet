angular.module('sm-meetApp.oneMap',  ['firebase', 'ngCookies'])

.controller('OneMapCtrl', function($scope, $firebaseObject, OneMap, $cookieStore, $localStorage, $state, $q, Login) {

  angular.extend($scope, OneMap);
  OneMap.initialize();

  var map;

  $scope.mockFriends = [
    {name:'Brett Leibowitz', image:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xta1/v/t1.0-1/p100x100/10577098_10202442901536904_4921330914277947787_n.jpg?oh=99d1a0849ec523b1d97c701669d9def0&oe=55A2B938&__gda__=1437312839_707288d58ce04e7703e83879be6bd55c'},
    {name:'Julia Hawkins', image:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xta1/v/t1.0-1/p100x100/10577098_10202442901536904_4921330914277947787_n.jpg?oh=99d1a0849ec523b1d97c701669d9def0&oe=55A2B938&__gda__=1437312839_707288d58ce04e7703e83879be6bd55c'},
    {name:'Bob Burger', image:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xta1/v/t1.0-1/p100x100/10577098_10202442901536904_4921330914277947787_n.jpg?oh=99d1a0849ec523b1d97c701669d9def0&oe=55A2B938&__gda__=1437312839_707288d58ce04e7703e83879be6bd55c'},
    {name:'Tony Tiger', image:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xta1/v/t1.0-1/p100x100/10577098_10202442901536904_4921330914277947787_n.jpg?oh=99d1a0849ec523b1d97c701669d9def0&oe=55A2B938&__gda__=1437312839_707288d58ce04e7703e83879be6bd55c'},
    {name:'Bill Nye', image:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xta1/v/t1.0-1/p100x100/10577098_10202442901536904_4921330914277947787_n.jpg?oh=99d1a0849ec523b1d97c701669d9def0&oe=55A2B938&__gda__=1437312839_707288d58ce04e7703e83879be6bd55c'},
    {name:'Thomas Train', image:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xta1/v/t1.0-1/p100x100/10577098_10202442901536904_4921330914277947787_n.jpg?oh=99d1a0849ec523b1d97c701669d9def0&oe=55A2B938&__gda__=1437312839_707288d58ce04e7703e83879be6bd55c'},
    {name:'Tina Turner', image:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xta1/v/t1.0-1/p100x100/10577098_10202442901536904_4921330914277947787_n.jpg?oh=99d1a0849ec523b1d97c701669d9def0&oe=55A2B938&__gda__=1437312839_707288d58ce04e7703e83879be6bd55c'},
    {name:'John Lennon', image:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xta1/v/t1.0-1/p100x100/10577098_10202442901536904_4921330914277947787_n.jpg?oh=99d1a0849ec523b1d97c701669d9def0&oe=55A2B938&__gda__=1437312839_707288d58ce04e7703e83879be6bd55c'},
    {name:'Taylor Hampshire', image:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xta1/v/t1.0-1/p100x100/10577098_10202442901536904_4921330914277947787_n.jpg?oh=99d1a0849ec523b1d97c701669d9def0&oe=55A2B938&__gda__=1437312839_707288d58ce04e7703e83879be6bd55c'},
    {name:'Peach Springs', image:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xta1/v/t1.0-1/p100x100/10577098_10202442901536904_4921330914277947787_n.jpg?oh=99d1a0849ec523b1d97c701669d9def0&oe=55A2B938&__gda__=1437312839_707288d58ce04e7703e83879be6bd55c'}
  ];

  $scope.chosenFriends = [];

  var populateAddress = function() {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': map.getCenter()}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var numberReverseAddress = results[0].address_components[0].short_name;
        var streetReverseAddress = results[0].address_components[1].short_name;
        $scope.shortReverseAddress = numberReverseAddress + ' ' + streetReverseAddress;
        $scope.fullReverseAddress = results[0].formatted_address;
        $scope.$apply();
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }

  var geocode = function() {
    dragListener = google.maps.event.addListener(map, 'dragend', function() {
      populateAddress();
    });
  };

  $scope.centerOnCurrentLoc = function() {
    // update userLoc
    Login.getLocation();
    // grab user loc
    var location = $localStorage.userloc;
    console.log(location)
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    var pos = new google.maps.LatLng(latitude, longitude);
    // center on user loc
    map.setCenter(pos);
    populateAddress();
  }

  $scope.clearAddress = function() {
    $scope.shortReverseAddress = '';
  }

  $scope.clearFriendFilter = function() {
    $scope.friendFilter = '';
  }

  $scope.isChosen = function(friend) {
    return $scope.chosenFriends.indexOf(friend) !== -1;
  }

  $scope.toggleSendee = function(friend, $event) {
    var index = $scope.chosenFriends.indexOf(friend);
    if (index !== -1) {
      $scope.chosenFriends.splice(index,1);
    } else {
      $scope.chosenFriends.push(friend);
    }
  }

  var init = function() {
    // OneMap.deleteMarkers();
    var currentUser = $localStorage.currentUser;
    var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+currentUser+"/currentEvent");
    // var eventSync = $firebase(currEventRef);
    // var currEventObj = eventSync.$asObject();
    var currEventObj = $firebaseObject(currEventRef);
    // user's current event
    currEventObj.$loaded().then(function() {
      if (currEventObj.$value) {
        $scope.isEvent = true;
        $scope.event = currEventObj.$value;
        OneMap.vergingDisplay();
      } else {
        $scope.isEvent = false;
      }
    });

    OneMap.clearMarkers();
    map = OneMap.getMap();
    angular.element(map.getDiv()).append(angular.element('<div/>').addClass('centerMarker'));
    // location input bar with autocomplete
    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));

    // google maps autocomplete
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
      }
      populateAddress();
    });

    google.maps.event.addListener(map, 'zoom_changed', function() {
      populateAddress();
    });
    populateAddress();
    geocode();
  }();
})

.factory('OneMap', function ($q, $location, $window, $rootScope, $cookieStore, $localStorage, $state, $firebaseObject) {
  // user location geofire
  var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/user_locations");
  var userGeoFire = new GeoFire(userRef);
  // event location geofire
  var refLoc = new Firebase("https://boiling-torch-2747.firebaseio.com/curr/locations");
  var geoFire = new GeoFire(refLoc);
  //archived location geofire
  var refArchivedLoc = new Firebase("https://boiling-torch-2747.firebaseio.com/archived/locations");
  var geoFireArchived = new GeoFire(refArchivedLoc);

  var markers = [];
  var reverseAddress;
  var map;
  var dragListener;
  var bounds = new google.maps.LatLngBounds();

  // Sets the map on all markers in the array.
  var setAllMap = function(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  var clearMarkers = function() {
    setAllMap(null);
  }

  // Shows any markers currently in the array.
  function showMarkers() {
    setAllMap(map);
  }

  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }

  var marker;
  var globalLatLng;

  var initialize = function() {
    drawMap();
  }

  // show attendees converging to an event on the screen
  var vergingDisplay = function() {
    var currentUser = $localStorage.currentUser;
    var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+currentUser+"/currentEvent");
    var currEventObj = $firebaseObject(currEventRef);
    // var currEventObj = eventSync.$asObject();
    // user's current event
    currEventObj.$loaded().then(function() {
      var eventLocRef = new Firebase("https://boiling-torch-2747.firebaseio.com/archived/locations/"+currEventObj.$value+"/l")
      var eventLocObj = $firebaseObject(eventLocRef);
      // var eventLocObj = eventLocSync.$asObject();
      // user's current event location
      eventLocObj.$loaded().then(function() {
        var pos = new google.maps.LatLng(eventLocObj[0], eventLocObj[1]);
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          draggable: false,
          title: currEventObj.$value,
          icon: '/img/icon_map_event_blue.png',
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
          $state.transitionTo('attendEvent', {id: currEventObj.$value});
        });
        var attendeeRef = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+currEventObj.$value+"/attendees");
        var attendeeObj = $firebaseObject(attendeeRef);
        // var attendeeObj = attendeeSync.$asObject();
        // attendees of user's current event
        attendeeObj.$loaded().then(function() {
          angular.forEach(attendeeObj, function(value, key) {
            if (key !== currentUser) {
              var userLocRef = new Firebase("https://boiling-torch-2747.firebaseio.com/user_locations/"+key+"/l");
              var userLocObject = $firebaseObject(userLocRef);
              // var userLocObject = userLocSync.$asObject();
              // attendee's location
              userLocObject.$loaded().then(function() {
                var pos = new google.maps.LatLng(userLocObject[0], userLocObject[1]);
                var marker = new google.maps.Marker({
                  position: pos,
                  map: map,
                  icon: '/img/icon_user_pos_animated.gif',
                  draggable: false,
                  title: key,
                  optimized : false
                });
                markers.push(marker);
                google.maps.event.addListener(marker, 'click', function() {
                  $state.transitionTo('userProfile', {id: key});
                });
              });
            }
          });
        });
      });
    });
  };

  /* Callback method from the geolocation API which receives the current user's location */
  // draws the map on the canvas centered at the user's location
  var drawMap = function(location) {
    // var userloc = $cookieStore.get('userloc');
    var userloc = $localStorage.userloc;
    console.log(userloc);
    var latitude = userloc.coords.latitude;
    var longitude = userloc.coords.longitude;
    var center = new google.maps.LatLng(latitude, longitude)
    var mapOptions = {
      zoom: 14,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var center = new google.maps.LatLng(latitude, longitude);
    var geoQuery = geoFire.query({
      center: [latitude, longitude],
      radius: 1.609344
    });
    map.setCenter(center);
    marker = new google.maps.Marker({
      position: center,
      map: map,
      icon: '/img/icon_user_pos_animated.gif',
      draggable: false,
      optimized : false,
      title: $localStorage.currentUser
    });
    bounds.extend(center);
    google.maps.event.addListener(marker, 'click', function() {
      $state.transitionTo('userProfile', {id: marker.title});
    });
    geolocationUpdate();
    // LOGIC HERE DETERMINING IF IN EVENT OR NOT
    var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$localStorage.currentUser+"/currentEvent");
    var currEventObj = $firebaseObject(currEventRef);
    // var currEventObj = eventSync.$asObject();
    currEventObj.$loaded().then(function() {
      if (currEventObj.$value) {
        vergingDisplay();
      }
    });

  }

  /* Handles any errors from trying to get the user's current location */
  var errorHandler = function(error) {
    if (error.code == 1) {
      console.error("Error: PERMISSION_DENIED: User denied access to their location");
    } else if (error.code === 2) {
      console.error("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
    } else if (error.code === 3) {
      console.error("Error: TIMEOUT: Calculating the user's location too took long");
      geolocationCallbackQuery($localStorage.userloc);
      // geolocationCallbackQuery($cookieStore.get('userloc'));
    } else {
      console.error("Unexpected error code")
    }
  };

  //Updates user location on movement
  var geolocationUpdate = function() {
    if(navigator.geolocation) {
      //var updateTimeout = {timeout: 1000};
      var geoLoc = navigator.geolocation;
      var watchID = geoLoc.watchPosition(showLocation, errorHandler)
    } else {
      throw new Error("geolocation not supported!");
    }
  }

  // updates user's location on the map when user moves
  var showLocation = function(position) {
    console.log(position);
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    globalLatLng = myLatlng;
    var userData = $localStorage.currentUser;
    //adds user location data to firebase
    userGeoFire.set(userData, [latitude, longitude]).then(function() {
    }, function(error) {
      console.error("Error: " + error);
    });

    //updates marker position by removing the old one and adding the new one
    if (marker == null) {
      marker = new google.maps.Marker({
        position: myLatlng,
        icon: '/img/icon_user_pos_animated.png',
        draggable: false
      });
      // markers.push(marker);
    } else {
      marker.setPosition(myLatlng);
    }

    if (marker && marker.setMap) {
      marker.setMap(null);
    }
    marker.setMap(map);
  }

  var centerMapLocation = function() {
    map.setCenter(globalLatLng);
  }

  // returns the map for use in controllers
  var getMap = function() {
    return map;
  }

  var getMarkers = function() {
    return markers;
  }

  var eventStatus = function() {
    var currentUser = $localStorage.currentUser;
    var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+currentUser+"/currentEvent");
    var currEventObj = $firebaseObject(currEventRef);
    // var currEventObj = eventSync.$asObject();
    // user's current event
    return currEventObj.$loaded().then(function() {
      return currEventObj.$value;
    });
  }


  return {
    centerMapLocation: centerMapLocation,
    initialize: initialize,
    getMap: getMap,
    getMarkers: getMarkers,
    clearMarkers: clearMarkers,
    reverseAddress: reverseAddress,
    map: map,
    drawMap: drawMap,
    vergingDisplay: vergingDisplay,
    eventStatus: eventStatus,
    showMarkers: showMarkers,
    deleteMarkers: deleteMarkers
  }

});
