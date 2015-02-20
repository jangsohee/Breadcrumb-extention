/**
 * Created by ChzMo on 2015-02-19.
 */

(function () {
    "use strict";

    angular
        .module('histree')
        .controller('LoginModalInstanceCtrl', LoginModalInstanceCtrl);

    LoginModalInstanceCtrl.$inject = ['$scope', '$modal', '$modalInstance', '$http', '$q', 'accountService', 'Com', 'baseUrl'];

    function LoginModalInstanceCtrl($scope, $modal, $modalInstance, $http, $q, accountService, Com, baseUrl) {
        var vm = this;

        vm.account = {
            email: '',
            password: ''
        };

        vm.submitLbl = "Login";
        vm.showSignForm = showSignForm;
        vm.submitLoginForm = submitLoginForm;

        ////////////////////////////

        function showSignForm() {
            var modalInstance = $modal.open({
                templateUrl: '../templates/sign-form.html',
                controller: 'SignModalInstanceCtrl',
                controllerAs: 'signModal',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.catch(function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }


        function submitLoginForm() {
            if ($scope.form.loginForm.$valid) {
                vm.submitLbl = "Process...";

                return login(vm.account)
                    .then(function (userInfo) {
                        $modalInstance.close();
                        return userInfo;
                    })
                    .catch(function () {
                        console.log("submit is canceling.");
                    })
                    .finally(function () {
                        vm.submitLbl = "Login";
                    });
            }
            else {
                console.log('loginForm is not in scope');
            }
        }


        function login(account) {
            var promise = accountService.login(account);
            console.log(promise);
            return promise
                .then(function (userInfo) {
                    // [BreadCrumb] Server Communication start --
                    Com.requestTree(userInfo.token);
                    return userInfo;
                })
                .catch(function () {
                    console.log("login failed");
                    return $q.reject();
                });
        }
    }
}) ();