angular.module('sm-meetApp.sendLoc',  ['firebase', 'ngCookies'])



.controller('SendLocCtrl', ["$scope",  "$firebaseAuth", "$cookieStore", "$state", "$q", "SendLoc",
  function($scope, $firebaseAuth, $cookieStore, $state, $q, Login) {


}])

.factory('SendLoc', function ($q, $location, $window, $rootScope, $cookieStore, $state, $firebase) {
  return {
  }
});
