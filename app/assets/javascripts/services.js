'use strict';

/* Services */

var rubyService = angular.module('ruby.services', []);

rubyService.value('version', '0.1');

rubyService.factory('ErrorHandler', function() {
    return function(error) {
        if (error.status == 404) {
            alertify.error("Sorry, the resource you are looking for doesn't seems to exist on the server!");
        } else if (error.status != 401 && error.status != 403) {
            alertify.error("Something went wrong. Please try again later.<br/>(Error code: " + error.status + ")");
        }
    };
});

rubyService.factory('Users', function($resource) {
    var Users = $resource('api/users/:id', {
        user_id : '@user_id'
    }, {
        getUsersList : {
            method : 'GET',
            url : 'api/users'
        },
        getUser : {
            method : 'GET',
            url : 'api/users/:id'
        },
        createUser : {
            method : 'POST',
            url : 'api/users'
        },
        update : {
            method : 'PUT',
            url : 'api/users/:id'
        },
        update_password : {
            method : 'PUT',
            url : 'api/users/:id/update_password'
        }
    });
    return Users;
});




