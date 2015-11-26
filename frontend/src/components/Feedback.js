import React from 'react'

const Feedback = function({ emailToPatient, emailTo }) {
    return (
            <section id="feedback">
            <h1>Feedback</h1>

            <p>Looking at this information, how do you feel about your level of drinking?</p>

            <p>Only you can make the decision to change your consumption. Here are some strategies you can try if you want to cut back:</p>

            <ul>
            <li>Setting personal drinking limits and sticking to it;</li>
            <li>Alternating alcoholic drinks with soft drinks;</li>
            <li>Switching to low alcohol drinks;</li>
            <li>Having regular alcohol-free days;</li>
            <li>Identifying high risk situations for heavy drinking and creating a management plan;</li>
            <li>Engaging in alternative activities to drinking</li>
            </ul>

            <div id="section-buttons">
            <button className="mdl-button mdl-button--raised mdl-button--colored" onClick={emailToPatient}>Email to Patient</button>
            <button className="mdl-button mdl-button--raised mdl-button--colored"  onClick={emailTo}>Email to…</button>
            </div>
            </section>
    );
}

export default Feedback
