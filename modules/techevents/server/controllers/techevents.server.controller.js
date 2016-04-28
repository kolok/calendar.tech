'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  TechEvent = mongoose.model('TechEvent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a techEvent
 */
exports.create = function (req, res) {
  var techEvent = new TechEvent(req.body);
  techEvent.user = req.user;

  techEvent.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(techEvent);
    }
  });
};

/**
 * Show the current techEvent
 */
exports.read = function (req, res) {
  res.json(req.techEvent);
};

/**
 * Update a techEvent
 */
exports.update = function (req, res) {
  var techEvent = req.techEvent;

  techEvent.title = req.body.title;
  techEvent.content = req.body.content;
  techEvent.started = req.body.started;
  techEvent.ended = req.body.ended;

  techEvent.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(techEvent);
    }
  });
};

/**
 * Delete an techEvent
 */
exports.delete = function (req, res) {
  var techEvent = req.techEvent;

  techEvent.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(techEvent);
    }
  });
};

/**
 * List of TechEvents
 */
exports.list = function (req, res) {
  TechEvent.find().sort('-created').populate('user', 'displayName').exec(function (err, techEvents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(techEvents);
    }
  });
};

/**
 * List of TechEvents
 */
exports.calendar = function (req, res) {
  TechEvent.find().sort('-created').populate('user', 'displayName').exec(function (err, techEvents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(techEvents);
    }
  });
};

/**
 * TechEvent middleware
 */
exports.techEventByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'TechEvent is invalid'
    });
  }

  TechEvent.findById(id).populate('user', 'displayName').exec(function (err, techEvent) {
    if (err) {
      return next(err);
    } else if (!techEvent) {
      return res.status(404).send({
        message: 'No techEvent with that identifier has been found'
      });
    }
    req.techEvent = techEvent;
    next();
  });
};
