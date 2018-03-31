angular.module('libraryMgmt')
.controller('DashboardCtrl',["$scope","$state",function ($scope, $state) {


   $scope.goto = function(page) {
        $state.go(page);
    };
}])