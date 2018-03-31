angular.module('libraryMgmt')
    .controller('BookCtrl',["$scope","$mdDialog","$http",function($scope,$mdDialog,$http){
        /*
        $scope.populateTable = function () {
            $scope.bookList = [];
            $http({
                method:'GET',
                url:'http://localhost:8080/libmanagement-1.0-SNAPSHOT/book/bookdetails'
            }).then(function successCallback(response){
                if(response.data.statusCode == 200){
                    var payload = response.data.payLoad
                    angular.forEach(payload,function(item){
                        var book = {}
                        book.Isbn = item.bookIsbn;
                        book.Title = item.bookTitle;
                        var authorname = "";
                        angular.forEach(item.bookAuthors, function(author){
                            if(authorname == ""){
                                authorname = author.bookAuthorName;
                            }else{
                                authorname = authorname+", "+author.bookAuthorName
                            }
                        })
                        book.Authors = authorname;
                        book.Availibility = item.available?"Yes":"No";
                        $scope.bookList.push(book);
                    })
                }else{
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .textContent(response.data.message)
                            .ok('Got it!')
                    )
                }
            })
        }
        $scope.populateTable();
        */






        $scope.showPrompt = function(row) {
            console.log(JSON.stringify(row))
            // Appending dialog to document.body to cover sidenav in docs app
          if(row.length == 1){
                if(row[0][3].value =="Yes"){
                    var confirm = $mdDialog.prompt()
                        .title("Please Enter Borrower's Card Id")
                        .placeholder('Enter Here')
                        .ariaLabel('Card Id')
                        .required(true)
                        .ok('Submit')
                        .cancel('Cancel');
                    $mdDialog.show(confirm).then(function(result) {
                        //todo call backend to create book loan
                        $http({
                            method:'POST',
                            url:"http://localhost:8080/libmanagement-1.0-SNAPSHOT/bookloan/bookcheckout",
                            params:{cardID:result,isbn:row[0][0].value}
                        }).then(function successCallback(response) {
                           $mdDialog.show(
                               $mdDialog.alert()
                                   .clickOutsideToClose(true)
                                   .textContent(response.data.message)
                                   .ok('OK')
                           )
                        })
                    }, function() {

                    });
                }else{
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('SORRY!')
                            .textContent('BOOK IS ALREADY CHECKED OUT')
                            .ok('OK')
                    );
                }



          }
        };

        $scope.bookList = [];

        $scope.searchBook = function (event) {
            if(event.which === 13){
                $scope.bookList = [];
                $http({
                    method: 'GET',
                    url: 'http://localhost:8080/libmanagement-1.0-SNAPSHOT/book/allbooks?searchString='+$scope.filterText
                }).then(function successCallback(response) {
                    if(response.data.statusCode == 200){
                        var payload = response.data.payLoad
                        angular.forEach(payload,function(item){
                            var book = {}
                            book.Isbn = item.bookIsbn;
                            book.Title = item.bookTitle;
                            var authorname = "";
                            angular.forEach(item.bookAuthors, function(author){
                                if(authorname == ""){
                                    authorname = author.bookAuthorName;
                                }else{
                                    authorname = authorname+", "+author.bookAuthorName
                                }
                            })
                            book.Authors = authorname;
                            book.Availibility = item.available?"Yes":"No";
                            $scope.bookList.push(book);
                        })
                    }else{
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

    }]);
