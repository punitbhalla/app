angular.module('libraryMgmt')
    .controller("FineCtrl",["$scope","$mdDialog","$http","$rootScope",function($scope, $mdDialog,$http,$rootScope) {
        var toggle;
        $scope.updateFines = function () {

            $http({
                method:'POST',
                url:'http://localhost:8080/libmanagement-1.0-SNAPSHOT/fines/genaratefine'
            }).then(function callbackSuccess(response){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('FINE UPDATE')
                        .textContent(response.data.message)
                        .ok('OK')
                )
            })

        };


        $scope.paidfinesummary = function () {
            toggle=false;
            $scope.fineList = [];
            $http({
                method:'GET',
                url:'http://localhost:8080/libmanagement-1.0-SNAPSHOT/fines/paidfinesummary'
            }
            ).then(function callbackSuccess(response){
                if(response.data.statusCode == 200){
                    var payload = response.data.payLoad;
                    angular.forEach(payload, function(item) {
                        var fine = {};
                        //fine.fineid = item.id;
                        fine.card_id = item.cardID;
                        fine.borrower_name = item.borrowerName;
                        fine.amount = item.outStandingFines;
                        $scope.fineList.push(fine);

                    })
                }else{
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('ERROR')
                            .textContent(response.data.message)
                            .ok('OK')
                    )
                }
            })

        };


        $scope.outstandingfinesummary = function () {
            toggle=true;
            $scope.fineList = [];

            $http({
                    method:'GET',
                    url:'http://localhost:8080/libmanagement-1.0-SNAPSHOT/fines/outstandingsummary'
                }
            ).then(function callbackSuccess(response){
                if(response.data.statusCode == 200){
                    var payload = response.data.payLoad;
                    angular.forEach(payload, function(item) {
                        var fine = {};
                        //fine.fineid = item.id;
                        fine.card_id = item.cardID;
                        fine.borrower_name = item.borrowerName;
                        fine.amount = item.outStandingFines;
                        $scope.fineList.push(fine);

                    })
                }else{
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('ERROR')
                            .textContent(response.data.message)
                            .ok('OK')
                    )
                }
            })

        };


        $scope.fineList = [];
        $http({
            method:'GET',
            url:'http://localhost:8080/libmanagement-1.0-SNAPSHOT/fines/outstandingsummary'
        }).then(function callbackSuccess(response){
                if(response.data.statusCode == 200){
                    var payload = response.data.payLoad;
                    angular.forEach(payload, function(item) {
                        var fine = {};
                        //fine.fineid = item.id;
                        fine.card_id = item.cardID;
                        fine.borrower_name = item.borrowerName;
                        fine.amount = item.outStandingFines;
                        $scope.fineList.push(fine);

                    })
                    toggle=true;
                }else{
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('ERROR')
                                .textContent(response.data.message)
                                .ok('OK')
                        )
                    }
                });


        $scope.showDetailedFines = function(row) {
            if (row.length == 1) {
                $rootScope.cardId = row[0][0].value;
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'html/borrowerfines.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                })
                    .then(function(answer) {
                    }, function() {
                    });
            }

        };


        function DialogController($scope, $mdDialog) {
            var urlPath;
            if(toggle){
                urlPath='http://localhost:8080/libmanagement-1.0-SNAPSHOT/fines/unpaidfines?cardID=';
            }
            else{
                urlPath='http://localhost:8080/libmanagement-1.0-SNAPSHOT/fines/paidfines?cardID=';
            }
            $scope.borrowerfineList =[];
            $http({
                method:'GET',
                url:urlPath+$rootScope.cardId
            }).then(function callbackSuccess(response){
                if(response.data.statusCode == 200){
                    var payload = response.data.payLoad
                    angular.forEach(payload,function(item){
                        var bfine = {};
                        bfine.loanid = item.loanID;
                        bfine.isbn = item.isbn;
                        bfine.title = item.bookTitle;
                        bfine.amount = item.fine;
                        $scope.borrowerfineList.push(bfine)
                    })
                }else{
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('ERROR')
                            .textContent(response.data.message)
                            .ok('OK')
                    )
                }
            });
            $scope.submit = function() {
                $mdDialog.hide();
            };



            $scope.showPrompt = function (row) {
                // Appending dialog to document.body to cover sidenav in docs app
                if (row.length == 1) {

                    var confirm = $mdDialog.prompt()
                        .title("Please enter the amount you want to pay")
                        .placeholder('Enter Here')
                        .ariaLabel('$')
                        .required(true)
                        .ok('Submit')
                        .cancel('Cancel');
                    $mdDialog.show(confirm).then(function (result) {
                        //todo call backend to create book loan
                        $http({
                            method:'POST',
                            url:'http://localhost:8080/libmanagement-1.0-SNAPSHOT/fines/payfine',
                            params:{amount:parseFloat(result),loanID:row[0][0].value}
                        }).then(function callbackSuccess(response){
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .textContent(response.data.message)
                                    .ok('OK')
                            )
                        })
                    }, function () {

                    });
                }
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };


        }
    }]);