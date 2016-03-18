import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux';

const Footer = connect(state => ({ state }))(({ thisPage, pageOrder, routeMap, state }) => {
    const i = pageOrder.indexOf(thisPage);
    let label = 'Done';
    let link = '/';
    if (i < pageOrder.length - 1) {
        label = 'Continue'
        link = pageOrder[i+1]
    }

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
                    <Continue thisPage={thisPage}
                              state={state}
                              className='mdl-button mdl-button--raised mdl-button--colored'
                              link={link}
                              label={label}
                    />
                </div>
            </section>

        </footer>
    );
});

const Continue = props => valid(props.thisPage, props.state) ? LinkToNext(props) : SpanToNext(props);

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
    if (!interviewer) {
        return false
    } else if (bio.age < 12 || bio.age > 110) {
        return false;
    } else if (page === 'info') {
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

export {
    Continue
}
