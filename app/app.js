(function () {
    'use strict';
 
    var app = angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    // Quick fix on angular >1.5.9 producing "possible unhandled rejection error
    app.config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }]);

    function config($stateProvider, $urlRouterProvider) {
        //$urlRouterProvider.hashPrefix = '!';
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: {activeTab: 'home'}
            })
            .state('sample', {
                url: '/sample',
                templateUrl: 'sample/index.html',
                controller: 'Sample.IndexController',
                controllerAs: 'vm',
                data: {activeTab: 'sample'}
            })

    }

    function run($http, $rootScope, $window) {
        //$http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
            console.log(event, toState, toParams, fromState, fromParams);
        })
    }

    /*
    // get JWT token from server
    $.get('/app/token', function (token) {
        window.jwtToken = token;
        angular.bootstrap(document, ['app']);
    });
    */

    $(function () {
        angular.bootstrap(document, ['app']);
    });
})();