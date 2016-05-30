'use strict';

// Declare app level module which depends on filters, and services
var rubyApp = angular.module('ruby', [
    'ui.router', 'ngCookies', 'ngResource', 'ngSanitize', 'ui.bootstrap', 'angular-loading-bar', 'dialogs.main', 'Devise',
    'ruby.services', 'ruby.directives', 'ruby.controllers', 'ruby.filters'
]);

rubyApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider, Auth) {

    var getResolvers = function(dict) {
        var key, value;
        for (key in dict) {
            value = dict[key];
            dict[key] = [
                value,
                function(a) {
                    return a();
                }
            ];
        }
        return dict;
    };

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/assets/home.html',
            controller: 'HomeCtrl',
        })
        .state('login', {
            url: '/login',
            templateUrl: '/assets/login.html',
            controller: 'AuthCtrl'
        })

        .state('usersList', {
            url: '/user/list',
            templateUrl: '/assets/users/usersList.html',
            controller: 'UsersListCtrl',
        })
        .state('createUser', {
            url: '/user/create',
            templateUrl: '/assets/users/createUser.html',
            controller: 'CreateUserCtrl',
        })
        .state('user', {
            url: '/user/{user_id}',
            templateUrl: '/assets/users/user.html',
            controller: 'UserCtrl',
        })
        ;

        $urlRouterProvider.otherwise('home');
}
]);

rubyApp.run(function($rootScope, $state, $stateParams, $location, $window, version, Auth) {
    $rootScope.$state = $state;
    $rootScope.version = version;
    //$rootScope.env = env;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.name !== 'login') {
            event.preventDefault();
            $rootScope.authenticated = false;

            Auth.currentUser().then(
                function () {
                    $rootScope.authenticated = true;
                    $rootScope.user = Auth._currentUser;

                    $state.go(toState.name, toParams, {notify: false, reload: true}).then(function() {
                        $rootScope.$broadcast('$stateChangeSuccess', toState, toParams, fromState, fromParams);
                    });

                },
                function(error){
                    $rootScope.authenticated = false;
                    $state.go('login',{ }, { reload: true, inherit: false });
                    //$window.location.href = '/#/login';
                }
            )
        }

    });

    // Call when the the client is confirmed
    $rootScope.$on('event:auth-loginConfirmed', function(data) {
        $rootScope.authenticated = true;
        if ($location.path() === "/login") {
            $state.go('home',{ }, { reload: true, inherit: false });
            //$window.location.href = '/#/home';
        }
    });

    // Call when the 401 response is returned by the server
    $rootScope.$on('event:auth-loginRequired', function(rejection) {
        $rootScope.authenticated = false;
        if ($location.path() !== "/login") {
            $state.go('login',{ }, { reload: true, inherit: false });
            //$window.location.href = '/#/login';
        }
    });


    // Call when the 403 response is returned by the server
    $rootScope.$on('event:auth-notAuthorized', function(rejection) {
        $rootScope.authenticated = false;
        $rootScope.loginErrorMessage = 'Access Denied!';
        if ($location.path() !== "/login") {
            $state.go('login',{ }, { reload: true, inherit: false });
            //$window.location.href = '/#/login';
        }
    });
});
