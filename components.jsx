"use strict";

var Link = require('react-router').Link;

var React = require('react');

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

var AuditPage = React.createClass({
    render: function() {
        var responses = this.props.values;
        var update = this.props.update;
        var questions = this.props.questions;
        var change = function(event) {
            var input = event.target
            update(1, input.name, input.value)
        }
        return (
            <section>
              <h1>Audit Questionnaire</h1>
              {questions.map(function(q, i) {
                return <Question key={q.key || q.text} q={q} onChange={change} value={(responses[i] || {}).answer} />
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
        return (
            <fieldset>
            <legend>{q.text}</legend>
            {q.answers.map(function(answer) {
                var value = answer.key || answer.text;
                var checked = undefined;
                if (selected === value) {
                    checked = "checked";
                }
                return <label key={(q.key || q.text) + value}>
                <input type="radio" checked={checked} name={q.key || q.text} value={value} onChange={cb} />
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
