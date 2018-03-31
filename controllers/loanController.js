angular.module('libraryMgmt')
    .controller("LoanCtrl",["$scope","$mdDialog","$http",function($scope,$mdDialog,$http){


        $scope.populateTable = function () {
            $scope.loans = [];
            $http({
                method:'GET',
                url:'http://localhost:8080/libmanagement-1.0-SNAPSHOT/bookloan/getbooksloans'
            }).then(function successCallback(response){
                if(response.data.statusCode == 200){
                    var payload = response.data.payLoad;
                    angular.forEach(payload,function(item){
                        var loan = {}
                        loan.loanid = item.loanID;
                        loan.title = item.bookTitle;
                        loan.card_id = item.cardID;
                        loan.borrower_name = item.borrowerName;
                        loan.date_out = new Date(item.bookDateOut).toUTCString();
                        loan.due_date = new Date(item.bookDueDate).toUTCString();
                        $scope.loans.push(loan);
                    })
                }else{
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



        $scope.enterIsbn = function(event){
            if(event.which === 13){
                $scope.loans = [];
                $http({
                    method: 'GET',
                    url: 'http://localhost:8080/libmanagement-1.0-SNAPSHOT/bookloan/getbooks?isbn='+$scope.isbn
                }).then(function successCallback(response) {
                    console.log(response);
                    if (response.data.statusCode == 200) {
                        var payload = response.data.payLoad
                        angular.forEach(payload, function (item) {
                            var loan = {}
                            loan.loanid = item.loanID;
                            loan.title = item.bookTitle;
                            loan.card_id = item.cardID;
                            loan.borrower_name = item.borrowerName;
                            loan.date_out = new Date(item.bookDateOut).toUTCString();
                            loan.due_date = new Date(item.bookDueDate).toUTCString();
                            $scope.loans.push(loan);
                        })
                    } else {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .textContent(response.data.message)
                                .ok('OK')
                        );
                    }

            })
        }
        }

        $scope.enterBorrowerId = function(event){
            if(event.which === 13){
                $scope.loans = [];
                var cardNumber;
                if($scope.borrowerId==null){
                    cardNumber=-1
                }
                else{
                    cardNumber=$scope.borrowerId
                }

                $http({
                    method: 'GET',
                    url: 'http://localhost:8080/libmanagement-1.0-SNAPSHOT/bookloan/getbooks?cardID='+cardNumber
                }).then(function successCallback(response) {
                    console.log(response);
                    if (response.data.statusCode == 200) {
                        var payload = response.data.payLoad
                        angular.forEach(payload, function (item) {
                            var loan = {}
                            loan.loanid = item.loanID;
                            loan.title = item.bookTitle;
                            loan.card_id = item.cardID;
                            loan.borrower_name = item.borrowerName;
                            loan.date_out = new Date(item.bookDateOut);
                            loan.due_date = new Date(item.bookDueDate);
                            $scope.loans.push(loan);
                        })
                    } else {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .textContent(response.data.message)
                                .ok('OK')
                        );
                    }

                })
            }
        }

        $scope.enterName = function(event){
            if(event.which === 13){
                $scope.loans = [];
                $http({
                    method: 'GET',
                    url: 'http://localhost:8080/libmanagement-1.0-SNAPSHOT/bookloan/getbooks?borrowerName='+$scope.nameSubStr
                }).then(function successCallback(response) {
                    console.log(response);
                    if (response.data.statusCode == 200) {
                        var payload = response.data.payLoad
                        angular.forEach(payload, function (item) {
                            var loan = {}
                            loan.loanid = item.loanID;
                            loan.title = item.bookTitle;
                            loan.card_id = item.cardID;
                            loan.borrower_name = item.borrowerName;
                            loan.date_out = new Date(item.bookDateOut);
                            loan.due_date = new Date(item.bookDueDate);
                            $scope.loans.push(loan);
                        })
                    } else {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .textContent(response.data.message)
                                .ok('OK')
                        );
                    }

                })
            }
        }

        $scope.checkin = function(row) {
            console.log(row);
            if (row.length == 1) {
                var confirm = $mdDialog.confirm()
                    .title("Are you sure you want to return this book?")
                    .ok('Yes')
                    .cancel("Cancel");
                $mdDialog.show(confirm).then(function (result) {
                    //todo call backend to create book loan
                    $http({
                        method: 'POST',
                        url: "http://localhost:8080/libmanagement-1.0-SNAPSHOT/bookloan/bookcheckin",
                        params: {loanID:row[0][0].value}
                    }).then(function successCallback(response) {
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
        }
    }])