(function () {
    'use strict'

    angular
        .module('app')
        .factory('SampleService', Service);

        function Service($http, $q) {
            var service = {}
 
            service.getLocation = getLocation;
            service.setLocation = setLocation;
    
            return service;
    
            function getLocation() {
                return $http.get('/sample/location').then(handleSuccess, handleError);
            }
    
            function setLocation(data) {
                const body = {
                    id: data.id
                }
                return $http.post('/sample/location', body).then(handleSuccess, handleError);
            }
    
            // private functions
    
            function handleSuccess(res) {
                return res.data;
            }
    
            function handleError(res) {
                return $q.reject(res.data);
            }
        }
        
})();