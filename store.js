"use strict";

var Redux = require("redux");


var UPDATE_BIO = "UPDATE_BIO";
var ANSWER = "ANSWER";

var initialState = {
  bio: {},
  survey: []
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
function Answer(index, text, answer) {
  return {
    type: ANSWER,
    field: "survey",
    fn: function(state) {
      console.log(index)
      console.log(text)
      console.log(answer)
      console.log(state)
      return state
    }
  }
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

var ReduxDev = require("redux-devtools");

var create = Redux.compose(ReduxDev.devTools())(Redux.createStore)
var store = create(surveyApp);

module.exports = {
  Store: store,
  UpdateBio: UpdateBio,
  Answer: Answer
}
