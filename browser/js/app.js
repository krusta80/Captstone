
window.app = angular.module('FullstackGeneratedApp', ['fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'toggle-switch', 'filters', 'nvd3', 'ngDialog', 'ngToast', 'xeditable']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });
});
app.config(['ngToastProvider', function(ngToastProvider) {
  ngToastProvider.configure({
    animation: 'slide' // or 'fade'
  });
}]);


// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state, $window, Messenger, $location, editableOptions) {
    // this is setting messenger factory to the window object
    $window.messenger = Messenger;
    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function (state) {
        return state.data && state.data.authenticate;
    };
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

    // $stateChangeStart is an event fired
    // whenever the procex`ss of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });

    });

});

/**
 * Description:
 *     removes white space from text. useful for html values that cannot have spaces
 * Usage:
 *   {{some_text | nospace}}
 */
app.filter('nospace', function () {
  return function (value) {
    return (!value) ? '' : value.replace(/ /g, '');
  };
});


angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length, end) {
            if (typeof text === "undefined") {
                return "";
            }
            if (isNaN(length))
                length = 10;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });

app.controller('MainController', function($scope, ngToast, $timeout, $rootScope) {
  $timeout(function(){
    // ngToast.create({
    //   className: 'danger',
    //   content: '<p>Test toast!</p>'
    // });

  }, 2000);
    $scope.masterLoader = false;
    $rootScope.$on('masterLoader', function(event, boolean) {
      $scope.masterLoader = boolean;
    });
    $scope.theme = {};
    $scope.theme.color = "theme-pink";
    $scope.theme.template = "theme-template-dark";
    if(!window.server)
        window.server = "http://localhost:1337";
    if(!window.socket) {
        window.socket = io(server);
        window.socket.on('acknowledged', function(connection) {
            console.log("Connected via socket.io (", connection.id, ")");
        });
        window.socket.on('jobUpdate', function(update) {
            console.log("job update:", update);
            window.isRunning = update.isRunning;
            ngToast.create({
              className: update.status === 'success' ? 'success' : 'danger',
              content: update.template
            });
            $scope.$apply();

        });
    }

});
