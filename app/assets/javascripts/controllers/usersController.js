angular.module('ruby.controllers').controller('UsersListCtrl', function($scope, $location, $state, Users, ErrorHandler) {

    $scope.usersCount = 0;
    $scope.usersList = null;

    $scope.headers = [ {
        title	: 'Id',
        value	: 'id'
    }, {
        title	: 'Email',
        value	: 'email'
    }, {
        title	: 'First name',
        value	: 'firstname'
    }, {
        title	: 'Last name',
        value	: 'lastname'
    }, {
        title	: 'Deleted',
        value	: 'isdeleted',
        default : '',
        type    : 'boolean'
    }];


    // default criteria that will be sent to the server
    $scope.filterCriteria = {
        pageSize : 10,
        pageNumber : 1,
        sortDir : 'asc',
        sortedBy : 'id'
    };

    // The function that is responsible of fetching the result from the server and setting the grid to the new result
    $scope.fetchResult = function() {

        var usersList = Users.getUsersList($scope.filterCriteria, function() {
            $scope.usersList = usersList.users;
            $scope.usersCount = usersList.count;
        }, ErrorHandler);

        return usersList;
    };

    $scope.go = function(user) {
        $state.go('user', {"user_id": user.id});
    };

}).controller('UserCtrl', function($scope, $location, $window, $stateParams, $state, dialogs, Users, ErrorHandler) {

    var userForm = Users.getUser({ id : $stateParams.user_id }, function() {
        $scope.userForm = userForm.user;
    }, ErrorHandler);

    $scope.update = function() {
        Users.update({ id : $stateParams.user_id }, $scope.userForm, function() {
            alertify.success('User successfully updated !');
            $state.go('user', {"user_id": $stateParams.user_id});
        }, ErrorHandler);
    };

    $scope.remove = function() {
        var dlg = dialogs.confirm('Please Confirm', 'Do you realy want to remove this user?');
        dlg.result.then(function(btn) {
            $scope.userForm.isdeleted = true;
            Users.update({ id : $stateParams.user_id }, $scope.userForm, function() {
                alertify.success('User successfully remove !');
                $state.go('user', {"user_id": $stateParams.user_id});
            }, ErrorHandler);
        });
    };

    $scope.restore = function() {
        var dlg = dialogs.confirm('Please Confirm', 'Do you realy want to restore this user?');
        dlg.result.then(function(btn) {
            $scope.userForm.isdeleted = false;
            Users.update({ id : $stateParams.user_id }, $scope.userForm, function() {
                alertify.success('User successfully restore !');
                $state.go('user', {"user_id": $stateParams.user_id});
            }, ErrorHandler);
        });
    };

    $scope.changePassword = {
        password : null,
        password_confirm : null
    };

    $scope.changePasswordFct = function() {
        Users.update_password({ id : $stateParams.user_id  }, $scope.changePassword, function(data, status, header) {
            alertify.success('Password successfully changed !');
            $scope.changePassword = { password : null, password_confirm : null };
            $state.go('user', {"user_id": $stateParams.user_id});
        }, ErrorHandler);
    };

}).controller('CreateUserCtrl', function($scope, $location, $window, $state, $stateParams, Users, ErrorHandler) {

    $scope.createUserFct = function() {
        var buff =  { user : angular.copy($scope.createUser) };
        delete buff.user.password2;

        Users.createUser({}, buff, function(data, status, header) {
            alertify.success('User successfully created !');
            $state.go('usersList');
        }, ErrorHandler);
    };
});