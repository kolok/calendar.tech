'use strict';

//TechEvents service used for communicating with the techEvents REST endpoints
angular.module('techEvents').factory('TechEvents', ['$resource',
  function ($resource) {
    return $resource('api/techEvents/:techEventId', {
      techEventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
