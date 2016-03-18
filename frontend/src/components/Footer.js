import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux';
import FeedbackSection from 'components/FeedbackSection'
import { post as postFeedback } from 'actions/feedback'

const FeedbackButton = ({ show, status, onPost }) => {
    if (show) {
        return <FeedbackSection status={status} onPost={onPost} />;
    } else {
        return <div></div>;
    }
}

const Footer = connect(state => ({ state }), { postFeedback })(({ thisPage, pageOrder, routeMap, state, postFeedback }) => {
    const i = pageOrder.indexOf(thisPage);
    let label = 'Done';
    let link = '/';
    if (i < pageOrder.length - 1) {
        label = 'Continue'
        link = pageOrder[i+1]
    }

    const Continue = valid(thisPage, state) ? LinkToNext : SpanToNext;

    const pageCount = pageOrder.length;

    return (
        <footer className={'page-'+thisPage}>
            <section id='footer-links'>
                {pageOrder.map((result, j) => {
                    const page = routeMap[result];
                    const fn = <FooterLink key={page} currentPageIdx={i} thisPageIdx={j} title={page[1]} target={result} />
                    if (j == pageCount - 1) {
                        return fn
                    } else {
                        return <span key={page}>{fn}<span className='footer-separator'>›</span></span>
                    }
                })}
                <div id='start-button'>
                    <Continue className='mdl-button mdl-button--raised mdl-button--colored' link={link} label={label} />
                    <FeedbackButton
                        show={i === pageOrder.length - 1}
                        status={state.postingFeedback}
                        onPost={postFeedback}
                    />
                </div>
            </section>

        </footer>
    );
});

const FooterLink = ({ currentPageIdx, thisPageIdx, title, target }) => {
    if (thisPageIdx < currentPageIdx) {
        return <Link className='footer-link' to={target}>{title}</Link>
    } else if (thisPageIdx === currentPageIdx) {
        return <strong className='footer-link'>{title}</strong>
    } else {
        return <span className='footer-link'>{title}</span>
    }
}

var LinkToNext = function(props) {
    return <Link className={props.className} to={props.link}>{props.label}</Link>
}

var SpanToNext = function(props) {
    return <span className={props.className} disabled='disabled'>{props.label}</span>
}

function valid(page, { interviewer, bio, survey, lastQuestion }) {
    if (bio.age < 12 || bio.age > 110) {
        return false;
    }
    if (page === 'info') {
        return !!interviewer &&
            !!bio.gender &&
            !!bio.age &&
            !!bio.postcode
    } else if (page === 'audit') {
        for (var i = 0; i <= lastQuestion; ++i) {
            if (!survey[i] || !survey[i].answer) {
                return false
            }
        }
    }
    return true;
}

export default Footer;
