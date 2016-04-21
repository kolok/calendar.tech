'use strict';

(function () {
  // TechEvents Controller Spec
  describe('TechEvents Controller Tests', function () {
    // Initialize global variables
    var TechEventsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      TechEvents,
      mockTechEvent;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _TechEvents_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      TechEvents = _TechEvents_;

      // create mock techEvent
      mockTechEvent = new TechEvents({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An TechEvent about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the TechEvents controller.
      TechEventsController = $controller('TechEventsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one techEvent object fetched from XHR', inject(function (TechEvents) {
      // Create a sample techEvents array that includes the new techEvent
      var sampleTechEvents = [mockTechEvent];

      // Set GET response
      $httpBackend.expectGET('api/techEvents').respond(sampleTechEvents);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.techEvents).toEqualData(sampleTechEvents);
    }));

    it('$scope.findOne() should create an array with one techEvent object fetched from XHR using a techEventId URL parameter', inject(function (TechEvents) {
      // Set the URL parameter
      $stateParams.techEventId = mockTechEvent._id;

      // Set GET response
      $httpBackend.expectGET(/api\/techEvents\/([0-9a-fA-F]{24})$/).respond(mockTechEvent);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.techEvent).toEqualData(mockTechEvent);
    }));

    describe('$scope.create()', function () {
      var sampleTechEventPostData;

      beforeEach(function () {
        // Create a sample techEvent object
        sampleTechEventPostData = new TechEvents({
          title: 'An TechEvent about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An TechEvent about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (TechEvents) {
        // Set POST response
        $httpBackend.expectPOST('api/techEvents', sampleTechEventPostData).respond(mockTechEvent);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the techEvent was created
        expect($location.path.calls.mostRecent().args[0]).toBe('techEvents/' + mockTechEvent._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/techEvents', sampleTechEventPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock techEvent in scope
        scope.techEvent = mockTechEvent;
      });

      it('should update a valid techEvent', inject(function (TechEvents) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/techEvents\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/techEvents/' + mockTechEvent._id);
      }));

      it('should set scope.error to error response message', inject(function (TechEvents) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/techEvents\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(techEvent)', function () {
      beforeEach(function () {
        // Create new techEvents array and include the techEvent
        scope.techEvents = [mockTechEvent, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/techEvents\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockTechEvent);
      });

      it('should send a DELETE request with a valid techEventId and remove the techEvent from the scope', inject(function (TechEvents) {
        expect(scope.techEvents.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.techEvent = mockTechEvent;

        $httpBackend.expectDELETE(/api\/techEvents\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to techEvents', function () {
        expect($location.path).toHaveBeenCalledWith('techEvents');
      });
    });
  });
}());
