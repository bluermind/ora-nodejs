(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('Home.IndexController', Controller);
 
    function Controller(UserService) {
        var vm = this;
 
        vm.user = null;
 
        initController();
 
        function initController() {
            // get current user
            vm.user = "방문자님";
        }
    }
 
})();