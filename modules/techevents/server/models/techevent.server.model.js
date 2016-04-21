'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * TechEvent Schema
 */
var TechEventSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('TechEvent', TechEventSchema);
