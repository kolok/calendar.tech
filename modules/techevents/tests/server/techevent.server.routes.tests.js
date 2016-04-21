'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  TechEvent = mongoose.model('TechEvent'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, techEvent;

/**
 * TechEvent routes tests
 */
describe('TechEvent CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new techEvent
    user.save(function () {
      techEvent = {
        title: 'TechEvent Title',
        content: 'TechEvent Content'
      };

      done();
    });
  });

  it('should be able to save an techEvent if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new techEvent
        agent.post('/api/techEvents')
          .send(techEvent)
          .expect(200)
          .end(function (techEventSaveErr, techEventSaveRes) {
            // Handle techEvent save error
            if (techEventSaveErr) {
              return done(techEventSaveErr);
            }

            // Get a list of techEvents
            agent.get('/api/techEvents')
              .end(function (techEventsGetErr, techEventsGetRes) {
                // Handle techEvent save error
                if (techEventsGetErr) {
                  return done(techEventsGetErr);
                }

                // Get techEvents list
                var techEvents = techEventsGetRes.body;

                // Set assertions
                (techEvents[0].user._id).should.equal(userId);
                (techEvents[0].title).should.match('TechEvent Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an techEvent if not logged in', function (done) {
    agent.post('/api/techEvents')
      .send(techEvent)
      .expect(403)
      .end(function (techEventSaveErr, techEventSaveRes) {
        // Call the assertion callback
        done(techEventSaveErr);
      });
  });

  it('should not be able to save an techEvent if no title is provided', function (done) {
    // Invalidate title field
    techEvent.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new techEvent
        agent.post('/api/techEvents')
          .send(techEvent)
          .expect(400)
          .end(function (techEventSaveErr, techEventSaveRes) {
            // Set message assertion
            (techEventSaveRes.body.message).should.match('Title cannot be blank');

            // Handle techEvent save error
            done(techEventSaveErr);
          });
      });
  });

  it('should be able to update an techEvent if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new techEvent
        agent.post('/api/techEvents')
          .send(techEvent)
          .expect(200)
          .end(function (techEventSaveErr, techEventSaveRes) {
            // Handle techEvent save error
            if (techEventSaveErr) {
              return done(techEventSaveErr);
            }

            // Update techEvent title
            techEvent.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing techEvent
            agent.put('/api/techEvents/' + techEventSaveRes.body._id)
              .send(techEvent)
              .expect(200)
              .end(function (techEventUpdateErr, techEventUpdateRes) {
                // Handle techEvent update error
                if (techEventUpdateErr) {
                  return done(techEventUpdateErr);
                }

                // Set assertions
                (techEventUpdateRes.body._id).should.equal(techEventSaveRes.body._id);
                (techEventUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of techEvents if not signed in', function (done) {
    // Create new techEvent model instance
    var techEventObj = new TechEvent(techEvent);

    // Save the techEvent
    techEventObj.save(function () {
      // Request techEvents
      request(app).get('/api/techEvents')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single techEvent if not signed in', function (done) {
    // Create new techEvent model instance
    var techEventObj = new TechEvent(techEvent);

    // Save the techEvent
    techEventObj.save(function () {
      request(app).get('/api/techEvents/' + techEventObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', techEvent.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single techEvent with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/techEvents/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'TechEvent is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single techEvent which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent techEvent
    request(app).get('/api/techEvents/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No techEvent with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an techEvent if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new techEvent
        agent.post('/api/techEvents')
          .send(techEvent)
          .expect(200)
          .end(function (techEventSaveErr, techEventSaveRes) {
            // Handle techEvent save error
            if (techEventSaveErr) {
              return done(techEventSaveErr);
            }

            // Delete an existing techEvent
            agent.delete('/api/techEvents/' + techEventSaveRes.body._id)
              .send(techEvent)
              .expect(200)
              .end(function (techEventDeleteErr, techEventDeleteRes) {
                // Handle techEvent error error
                if (techEventDeleteErr) {
                  return done(techEventDeleteErr);
                }

                // Set assertions
                (techEventDeleteRes.body._id).should.equal(techEventSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an techEvent if not signed in', function (done) {
    // Set techEvent user
    techEvent.user = user;

    // Create new techEvent model instance
    var techEventObj = new TechEvent(techEvent);

    // Save the techEvent
    techEventObj.save(function () {
      // Try deleting techEvent
      request(app).delete('/api/techEvents/' + techEventObj._id)
        .expect(403)
        .end(function (techEventDeleteErr, techEventDeleteRes) {
          // Set message assertion
          (techEventDeleteRes.body.message).should.match('User is not authorized');

          // Handle techEvent error error
          done(techEventDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      TechEvent.remove().exec(done);
    });
  });
});
