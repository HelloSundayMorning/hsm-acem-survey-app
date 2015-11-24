"use strict";

import React from 'react'

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

export default Question
