(function () {
    'use strict';

    angular
        .module('app')
        .controller('Sample.IndexController', Controller)

    /**
     * Sample Controller
     * 
     * @param {any} $window 
     * @param {any} SampleService 
     * @param {any} FlashService 
     */
    function Controller($window, SampleService, FlashService) {
        var vm = this;   
        vm.locations = []; 
        vm.getLocation = getLocation;      
        vm.setLocation = setLocation;

        initController();

        function initController() {
            vm.locations = getLocation();
        }

        function getLocation() {
            LightService.getLocation().then(function (resdata) {
                FlashService.Success(resdata);
            }).catch(function (error) {
                FlashService.Error(error)
            });
        }

        function setLocation() {
            LightService.setLocation(vm.location).then(function (resdata) {
                FlashService.Success(resdata);
            }).catch(function (error) {
                FlashService.Error(error)
            });
        }

    }
})();