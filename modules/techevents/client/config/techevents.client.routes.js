'use strict';

// Setting up route
angular.module('techEvents').config(['$stateProvider',
  function ($stateProvider) {
    // TechEvents state routing
    $stateProvider
      .state('techEvents', {
        abstract: true,
        url: '/techEvents',
        template: '<ui-view/>'
      })
      .state('techEvents.list', {
        url: '',
        templateUrl: 'modules/techEvents/client/views/list-techevents.client.view.html'
      })
      .state('techEvents.calendar', {
        url: '',
        templateUrl: 'modules/techEvents/client/views/calendar-techevents.client.view.html'
      })
      .state('techEvents.create', {
        url: '/create',
        templateUrl: 'modules/techEvents/client/views/create-techevent.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('techEvents.view', {
        url: '/:techEventId',
        templateUrl: 'modules/techEvents/client/views/view-techevent.client.view.html'
      })
      .state('techEvents.edit', {
        url: '/:techEventId/edit',
        templateUrl: 'modules/techEvents/client/views/edit-techevent.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
