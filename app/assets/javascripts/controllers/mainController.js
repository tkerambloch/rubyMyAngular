'use strict';

angular.module('ruby.controllers', [])
    .controller('MainCtrl', function($scope, $location, $timeout, $window, ErrorHandler, Auth, $rootScope, $state) {
        $scope.isActive = function(viewLocation) {
            if (viewLocation === '/') {
                return $location.path() === viewLocation;
            }
            return $location.path().indexOf(viewLocation) === 0;
        };


        $scope.logout = function ()
        {
            Auth.logout();
        }

        $scope.$on('devise:logout', function (e, user){
            $rootScope.user = {};
            $rootScope.authenticated = false;
            $state.go('login');
        });

    })
    .controller('AuthCtrl', function($scope, $state, $location, $window, Auth, $rootScope){
        $scope.loginErrorMessage = "";
        $scope.loginFail = false;

        $scope.login = function() {
            Auth.login($scope.userForm).then(function(user){
                $rootScope.user = user;
                $rootScope.authenticated = true;
                $state.go('home');
            }, function(error){
                $scope.loginErrorMessage = error.statusText;
                $scope.loginFail = true;
            });
        };

        $scope.$on('devise:login', function (e, user){
            $rootScope.user = user;
            $rootScope.authenticated = true;
            $state.go('home');
        });
    })
    .controller('HomeCtrl', function($scope, $window, ErrorHandler) {
    })
;




