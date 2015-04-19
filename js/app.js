// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var meetApp = angular.module('sm-meetApp',
  [
    // external modules
    'firebase',
    'ui.router',
    'ngCookies',
    'ngStorage',
    'sm-meetApp.login',
    'sm-meetApp.currentUser',
    'sm-meetApp.oneMap',
    'sm-meetApp.vertDrag'
  ])

// set up routing
.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl : 'views/login.html',
      controller: 'LoginCtrl'
    })
    .state('map', {
      url: '/map',
      templateUrl: 'views/map.html',
      controller: 'OneMapCtrl'
    })
});

