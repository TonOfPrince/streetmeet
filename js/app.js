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
    'angular-gestures',
    'sm-meetApp.login',
    'sm-meetApp.createEvents',
    'sm-meetApp.joinEvent',
    'sm-meetApp.userInterfaceController',
    'sm-meetApp.currentUser',
    // 'sm-meetApp.event',
    'sm-meetApp.profile',
    'sm-meetApp.editEvent',
    'sm-meetApp.profileSettings',
    'sm-meetApp.oneMap',
    'sm-meetApp.sendLoc',
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
    .state('createEvent', {
      url: '/createEvent',
      templateUrl: 'views/createEventForm.html',
      controller: 'CreateEventsCtrl'
    })
    .state('listCurrentEvents', {
      url: '/listEvents',
      templateUrl: 'views/listCurrentEvents.html',
      controller: 'JoinEventCtrl'
    })
    // .state('attendEvent', {
    //   url: '/event/:id',
    //   templateUrl: 'views/attendEvent.html',
    //   controller: 'EventCtrl'
    // })
    .state('settings', {
      url: '/settings',
      templateUrl: 'views/userSettings.html',
    })
    .state('userProfile', {
      url: '/userProfile/:id',
      templateUrl: 'views/userProfile.html',
      controller: 'SettingsCtrl'
    })
    .state('map', {
      url: '/map',
      templateUrl: 'views/map.html',
      controller: 'OneMapCtrl'
    })
    .state('userProfileSettings', {
      url: '/userProfileSettings/:id',
      templateUrl: 'views/userProfileSettings.html',
      controller: 'ProfileSettingsCtrl'
    })
    .state('editEventSettings', {
      url: '/editEvent/:id',
      templateUrl: 'views/editEvent.html',
      controller: 'EditEventCtrl'
    })
    .state('sendLoc', {
      url: '/sendLoc',
      templateUrl: 'views/sendLoc.html',
      controller: 'SendLocCtrl'
    })
});

