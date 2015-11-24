"use strict";

import React from 'react'
import Question from "components/Question"

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

export default AuditPage
