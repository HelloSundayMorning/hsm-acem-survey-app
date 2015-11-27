"use strict";

import React from 'react'

const Question = ({ q, onChange, value, disabled }) => {
    disabled = !!disabled ? "disabled" : ""
    return (
            <section className={disabled + " question"}>
            <span className="legend">{q.text}</span>
            <div>
            {q.answers.map(answer => {
                const val = answer.key || answer.text;
                let checked = "";
                let className = "";
                if (value === val) {
                    checked = "checked";
                    className = "mdl-button--colored";
                }
                return <label className={className + " mdl-button mdl-js-button mdl-button--raised"} key={(q.key || q.text) + val}>
                    <input type="radio" checked={checked} name={q.key || q.text} value={val} onChange={(event) => onChange(event.target, q, answer)} disabled={disabled} />
                    {answer.text}
                </label>
            })}
        </div>
            </section>
    )
}

export default Question
