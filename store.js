"use strict";

var Redux = require("redux");


var UPDATE_BIO = "UPDATE_BIO";
var ANSWER = "ANSWER";
var SET_INTERVIEWER = "SET_INTERVIEWER";
var EMAIL_TO_PATIENT = "EMAIL_TO_PATIENT";
var EMAIL_TO = "EMAIL_TO";

var initialState = {
  bio: {},
  survey: [],
  interviewer: null
}

function SetInterviewer(value) {
  return {
    type: SET_INTERVIEWER,
    field: "interviewer",
    value: value
  };
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
      var response = {
        question: text,
        answer: answer
      }

      // Prefix might be shorter than index, so pad it out.
      var newState = Array(state.length)
      for (var i = 0; i < state.length; ++i) {
        newState[i] = state[i]
      }

      // Set new one
      newState[index] = response

      return newState
    }
  }
}

function emailToPatient(state) {
  return {
    type: EMAIL_TO_PATIENT
  }
}

function emailTo(state) {
  return {
    type: EMAIL_TO
  }
}

function deliverEmail(state, email) {
  window.alert("to "+email+": "+JSON.stringify(state)+" to user");
}

function askAndDeliverEmail(state) {
  var res = window.prompt("Enter email address");
  deliverEmail(state, res);
}

function surveyApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  } else if (action.type === EMAIL_TO_PATIENT) {
    deliverEmail(state);
    return state;
  } else if (action.type === EMAIL_TO) {
    askAndDeliverEmail(state);
    return state;
  }

  var newState = Object.assign({}, state);

  if (!!action.value) {
    newState[action.field] = action.value;
  } else if (!!action.fn) {
    var field = state[action.field];
    newState[action.field] = action.fn(field);
  } else {
    newState = state; // Don't make a new one
  }
  return newState;
}

var ReduxDev = require("redux-devtools");

var create = Redux.compose(ReduxDev.devTools())(Redux.createStore)
var store = create(surveyApp);

module.exports = {
  Store: store,
  UpdateBio: UpdateBio,
  Answer: Answer,
  SetInterviewer: SetInterviewer,
  EmailToPatient: emailToPatient,
  EmailTo: emailTo
}
