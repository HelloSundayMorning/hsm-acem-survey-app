"use strict";

import { Link } from 'react-router'
import React from 'react'

const SurveyPage = ({ route, params }) => {
    const routeMap = route.routeMap;
    const pageOrder = route.pageOrder;
    const page = params.survey_page;
    const Component = routeMap[page][0];
    return (
            <div>
            <Component />
            <Footer routeMap={routeMap} pageOrder={pageOrder} thisPage={page} />
            </div>
    )
}

const Footer = ({ thisPage, pageOrder, routeMap }) => {
    const i = pageOrder.indexOf(thisPage);
    if (i < pageOrder.length - 1) {
        var label = "Continue"
        var link = pageOrder[i+1]
    } else {
        var label = "Done"
        var link = "/"
    }

    return (
            <footer className={"page-"+thisPage}>
            <h2>progress bar @ {thisPage}</h2>
            {pageOrder.map((result, j) => {
                const page = routeMap[result];
                return <FooterLink key={page} currentPageIdx={i} thisPageIdx={j} title={page[1]} target={result} />
            })}
            <Link className="next-page" to={link}>{label}</Link>
            </footer>
    );
}

const FooterLink = ({ currentPageIdx, thisPageIdx, title, target }) => {
    if (thisPageIdx < currentPageIdx) {
        return <Link to={target}>{title}<br/></Link>
    } else if (thisPageIdx === currentPageIdx) {
        return <strong>{title}<br/></strong>
    } else {
        return <div>{title}<br/></div>
    }
}


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

const AuditPage = ({ survey, gender, update, questions, start, end }) => {
    questions = questions.slice(start, end);
    const offset = start;

    const change = (i) =>
          (event, question, answer) => {
              console.log(question, answer)
              update(i, question, answer)
          }

    return (
            <section>
            <h1>Audit Questionnaire</h1>
            {questions.map((q, i) =>
                           <Question key={q.key || q.text} q={q} onChange={change(i + offset)} value={(survey[i+offset] || {answer: {}}).answer.text} disabled={questionDisabled(i + offset, survey, gender)} />
                          )}
        </section>
    );
}

const Question = ({ q, onChange, value, disabled }) => {
    disabled = !!disabled ? "disabled" : ""
    return (
            <fieldset className={disabled}>
            <legend>{q.text}</legend>
            {q.answers.map((answer, i) => {
                const val = answer.key || answer.text;
                let checked = undefined;
                if (value === val) {
                    checked = "checked";
                }
                return <label key={(q.key || q.text) + val}>
                    <input type="radio" checked={checked} name={q.key || q.text} value={val} onChange={(event) => onChange(event.target, q, answer)} disabled={disabled} />
                    {answer.text}
                </label>
            })}
        </fieldset>
    )
}

module.exports = {
    SurveyPage,
    AuditPage,
    Question
}
