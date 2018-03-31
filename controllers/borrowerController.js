angular.module('libraryMgmt')
    .controller("BorrowerCtrl", ["$scope", "$mdDialog", "$http", function ($scope, $mdDialog, $http) {

        $scope.populateTable = function () {
            $scope.borrowers = [];
            $http({
                method: 'GET',
                url: 'http://localhost:8080/libmanagement-1.0-SNAPSHOT/borrower/getborrower'
            }).then(function successCallback(response) {
                if (response.data.statusCode == 200) {
                    var payload = response.data.payLoad;
                    angular.forEach(payload, function (item) {
                        var borrower = {};
                        borrower.id = item.borrowerCardId;
                        borrower.ssn = item.borrowerSsn;
                        borrower.Name = item.borrowerBname;
                        borrower.Address = item.borrowerAddress;
                        borrower.Phone = item.borrowerPhone;
                        $scope.borrowers.push(borrower);
                    })
                } else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .textContent(response.data.message)
                            .ok('OK')
                    )
                }
            })
        }
        $scope.populateTable();
        $scope.createBorrower = function (ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'html/createBorrower.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
            })
                .then(function (answer) {
                }, function () {
                });
        };

        function DialogController($scope, $mdDialog, $http) {
            $scope.submit = function () {
                $http({
                    method: 'POST',
                    url: 'http://localhost:8080/libmanagement-1.0-SNAPSHOT/borrower/addborrower',
                    params: {
                        ssn: $scope.user.ssn,
                        bname: $scope.user.name,
                        address: $scope.user.address,
                        phoneNumber: $scope.user.phone
                    }
                }).then(function callBackSuccess(response) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .textContent(response.data.message)
                            .ok('OK')
                    )
                })
                $mdDialog.hide();

            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };


        }


    }]);