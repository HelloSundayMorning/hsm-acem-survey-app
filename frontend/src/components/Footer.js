import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux';

const Footer = connect(state => ({ state }))(({ thisPage, pageOrder, routeMap, state }) => {
    const i = pageOrder.indexOf(thisPage);
    if (i < pageOrder.length - 1) {
        var label = 'Continue'
        var link = pageOrder[i+1]
    } else {
        var label = 'Done'
        var link = '/'
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
            </section>
            <Continue className='mdl-button mdl-button--raised mdl-button--colored' link={link} label={label} />
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
