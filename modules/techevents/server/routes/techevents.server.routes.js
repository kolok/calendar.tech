'use strict';

/**
 * Module dependencies.
 */
var techEventsPolicy = require('../policies/techevents.server.policy'),
  techEvents = require('../controllers/techevents.server.controller');

module.exports = function (app) {
  // TechEvents collection routes
  app.route('/api/techEvents').all(techEventsPolicy.isAllowed)
    .get(techEvents.list)
    .post(techEvents.create);

  // Single techEvent routes
  app.route('/api/techEvents/:techEventId').all(techEventsPolicy.isAllowed)
    .get(techEvents.read)
    .put(techEvents.update)
    .delete(techEvents.delete);

  // Finish by binding the techEvent middleware
  app.param('techEventId', techEvents.techEventByID);
};
