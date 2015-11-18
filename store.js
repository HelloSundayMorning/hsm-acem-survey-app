"use strict";

var Redux = require("redux");


var UPDATE_BIO = "UPDATE_BIO";

var initialState = {
  bio: {}
}

function UpdateBio(field, value) {
  return {
    type: UPDATE_BIO,
    field: "bio",
    fn: function(state) {
      var update = {}
      update[field] = value
      return Object.assign({}, state, update)
    }
  };
}

function surveyApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  var field = state[action.field];
  var newState = Object.assign({}, state);
  newState[action.field] = action.fn(field);
    
  console.log(newState);
  return newState;
}

var store = Redux.createStore(surveyApp);

module.exports = {
  Store: store,
  UpdateBio: UpdateBio
}
