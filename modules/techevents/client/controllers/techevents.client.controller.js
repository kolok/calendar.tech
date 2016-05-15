'use strict';

// TechEvents controller
angular.module('techEvents').controller('TechEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'TechEvents', 'uiCalendarConfig',
  function ($scope, $stateParams, $location, Authentication, TechEvents, uiCalendarConfig) {
    $scope.authentication = Authentication;


// CALENDAR EXAMPLE
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

//    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };*/
    /* event source that contains custom events on the scope
    $scope.events = [
      { title: 'All Day Event',start: new Date(y, m, 1) },
      { title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2) },
      { id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false },
      { id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false },
      { title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false },
      { title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/' }
    ];*/
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [ { title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed'] } ];
      callback(events);
    };

/*
    $scope.calEventsExt = {
       color: '#f00',
       textColor: 'yellow',
       events: [
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
*/
    /* alert on eventClick */
    $scope.alertOnEventClick = function(date, jsEvent, view){
//      $scope.alertMessage = (date.title + ' was clicked ');
      alert(date.title + ' was clicked ');
    };
    /* alert on Drop
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };*/
    /* alert on Resize
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };*/
    /* add and removes an event source of choice
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };*/
    /* add custom event
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };*/
    /* remove event
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };*/
    /* Change View
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };*/
    /* Change View
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };*/
     /* Render Tooltip
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
                     'tooltip-append-to-body': true});
        $compile(element)($scope);
    };*/
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
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

/*
    $scope.changeLang = function() {
      if($scope.changeTo === 'Hungarian'){
        $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
        $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
        $scope.changeTo= 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo = 'Hungarian';
      }
    };
*/
    /* event sources array*/
//    $scope.eventSources = [];
//    $scope.eventSources = [$scope.events, /*$scope.eventSource,*/ $scope.eventsF];
//    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
//    $scope.eventSources = [$scope.events, $scope.eventsF];

// END OF CALENDAR EXAMPLE







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
        started: this.started,
        ended: this.ended,
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

// Display calendar
    $scope.calendar = function () {
      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();
      $scope.events = [
        { title: 'All Day Event',start: new Date(y, m, 1) },
        { title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2) },
        { id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false },
        { id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false },
        { title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false },
        { title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/' }
      ];
      $scope.eventsF = function (start, end, timezone, callback) {
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        var events = [ { title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed'] } ];
        callback(events);
      };
      $scope.eventSources = [$scope.events,$scope.eventsF];

// TODO : make this piece of code works, it doesn't because
      TechEvents.query().$promise.then(function(data){
        var events = [];
        var arrayLength = data.length;
        for (var i = 0; i < arrayLength; i++) {
          data[i].start=new Date(data[i].started);
          data[i].end=new Date(data[i].ended);
          events.push(data);
        }
        $scope.events = data;
        $scope.eventSources = [$scope.events,$scope.eventsF];
      });
    };


    // Find existing TechEvent
    $scope.findOne = function () {
      TechEvents.get({
        techEventId: $stateParams.techEventId
      }).$promise.then(function(data){
        data.started=new Date(data.started);
        data.ended=new Date(data.ended);
        $scope.techEvent = data;
      });
    };
  }
]);
