"use strict";

import { Link } from 'react-router'
import React from 'react'

var SurveyPage = React.createClass({
    render: function() {
        console.log(this.props);
        var routeMap = this.props.route.routeMap;
        var pageOrder = this.props.route.pageOrder;
        var page = this.props.params.survey_page;
        var Component = routeMap[page][0];
        return (
            <div>
            <Component />
            <Footer routeMap={routeMap} pageOrder={pageOrder} thisPage={page} />
            </div>
        )
    }
});

var Footer = React.createClass({
    render: function() {
        var thisPage = this.props.thisPage;
        var pageOrder = this.props.pageOrder;
        var routeMap = this.props.routeMap;
        var i = pageOrder.indexOf(thisPage);
        if (i < pageOrder.length - 1) {
            var label = "Continue"
            var link = pageOrder[i+1]
        } else {
            var label = "Done"
            var link = "/"
        }

        return (
            <footer className={"page-"+thisPage}>
            <h2>progress bar @ {this.props.thisPage}</h2>
            {pageOrder.map(function(result, j) {
                var page = routeMap[result];
                if (j < i) {
                    return (<div key={page}><Link className={"link-"+thisPage} to={result}>{page[1]}</Link><br /></div>)
                } else if (j === i) {
                    return (<strong key={page}>{page[1]}</strong>)
                } else {
                    return (<div key={page}>{page[1]}</div>)
                }
            })}
             <Link className="next-page" to={link}>{label}</Link>
            </footer>
        );
    }
});

function questionDisabled(qid, survey, gender) {
    const q1 = (!!survey[0] && survey[0].answer.score) || 0
    const q2 = (!!survey[1] && survey[1].answer.score) || 0
    const q3 = (!!survey[2] && survey[2].answer.score) || 0

    switch (qid) { // Zero-based!
    case 0: // Q1
        return false
    case 1: // Q2
    case 2: // Q3
        return q1 == 0
    default: // Q4-10
        if (q2 + q3 === 0) {
            return true
        }

        const cutoff = { "male": 4, "female": 3, "other": 3}

        return q1 + q2 + q3 < cutoff[gender]
    }
}

var AuditPage = React.createClass({
    render: function() {
        var survey = this.props.survey;
        var gender = this.props.gender;
        var update = this.props.update;
        var questions = this.props.questions.slice(this.props.start, this.props.end);
        var offset = this.props.start;

        const change = (i) =>
              (event, question, answer) => {
                  console.log(question, answer)
                  update(i, question, answer)
              }

        return (
            <section>
              <h1>Audit Questionnaire</h1>
              {questions.map(function(q, i) {
                  return <Question key={q.key || q.text} q={q} onChange={change(i + offset)} value={(survey[i+offset] || {answer: {}}).answer.text} disabled={questionDisabled(i + offset, survey, gender)} />
              })}
            </section>
        );
    }
});


var Question = React.createClass({
    render: function() {
        var q = this.props.q;
        var cb = this.props.onChange;
        var selected = this.props.value;
        var disabled = !!this.props.disabled
        return (
                <fieldset className={disabled ? "disabled" : ""}>
                <legend>{q.text}: {disabled ? "disabled" : "enabled"}</legend>
                {q.answers.map(function(answer, i) {
                    var value = answer.key || answer.text;
                var checked = undefined;
                if (selected === value) {
                    checked = "checked";
                }
                return <label key={(q.key || q.text) + value}>
                        <input type="radio" checked={checked} name={q.key || q.text} value={value} onChange={(event) => cb(event.target, q, answer)} disabled={disabled ? "disabled" : ""} />
                {answer.text}
                </label>
            })}
            </fieldset>
            )
    }
})

module.exports = {
    SurveyPage: SurveyPage,
    AuditPage: AuditPage,
    Question: Question
}
