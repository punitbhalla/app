angular.module('libraryMgmt')
.config(["$stateProvider","$urlRouterProvider",function ($stateProvider,$urlRouterProvider) {

    $stateProvider.state('dashboard',{
        url:'/dashboard',
        templateUrl:'html/dashboard.html',
        controller:'DashboardCtrl'
    }).state('dashboard.book', {
        url: '/books',
        templateUrl: 'html/books.html',
        controller: 'BookCtrl'

    }).state('dashboard.borrower',{
        url:'/borrowers',
        templateUrl:'html/borrowers.html',
        controller:"BorrowerCtrl"
    }).state('dashboard.loan',{
        url:'/loans',
        templateUrl:'html/loans.html',
        controller:'LoanCtrl'
    }).state('dashboard.fines',{
        url:'/fines',
        templateUrl:'html/fines.html',
        controller:'FineCtrl'
    })
    $urlRouterProvider.otherwise('/dashboard/books');
}])