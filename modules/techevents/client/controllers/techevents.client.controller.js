'use strict';

// TechEvents controller
angular.module('techEvents').controller('TechEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'TechEvents',
  function ($scope, $stateParams, $location, Authentication, TechEvents) {
    $scope.authentication = Authentication;
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
    // get the list of event to display in the interface
    $scope.eventSources = [];

    // Create new TechEvent
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'techEventForm');

        return false;
      }

      // Create new TechEvent object
      var techEvent = new TechEvents({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      techEvent.$save(function (response) {
        $location.path('techEvents/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing TechEvent
    $scope.remove = function (techEvent) {
      if (techEvent) {
        techEvent.$remove();

        for (var i in $scope.techEvents) {
          if ($scope.techEvents[i] === techEvent) {
            $scope.techEvents.splice(i, 1);
          }
        }
      } else {
        $scope.techEvent.$remove(function () {
          $location.path('techEvents');
        });
      }
    };

    // Update existing TechEvent
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'techEventForm');

        return false;
      }

      var techEvent = $scope.techEvent;

      techEvent.$update(function () {
        $location.path('techEvents/' + techEvent._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of TechEvents
    $scope.find = function () {
      $scope.techEvents = TechEvents.query();
    };

    // Find existing TechEvent
    $scope.findOne = function () {
      $scope.techEvent = TechEvents.get({
        techEventId: $stateParams.techEventId
      });
    };
  }
]);
