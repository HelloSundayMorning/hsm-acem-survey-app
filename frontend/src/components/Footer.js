"use strict";

import React from 'react'
import { Link } from 'react-router'
import { connect } from "react-redux";

const Footer = connect(state => ({ state }))(({ thisPage, pageOrder, routeMap, state }) => {
    const i = pageOrder.indexOf(thisPage);
    if (i < pageOrder.length - 1) {
        var label = "Continue"
        var link = pageOrder[i+1]
    } else {
        var label = "Done"
        var link = "/"
    }

    const Continue = valid(thisPage, state) ? LinkToNext : SpanToNext;

    return (
            <footer className={"page-"+thisPage}>
            <h2>progress bar @ {thisPage}</h2>
            {pageOrder.map((result, j) => {
                const page = routeMap[result];
                return <FooterLink key={page} currentPageIdx={i} thisPageIdx={j} title={page[1]} target={result} />
            })}
            <Continue link={link} label={label} />
            </footer>
    );
});

const FooterLink = ({ currentPageIdx, thisPageIdx, title, target }) => {
    if (thisPageIdx < currentPageIdx) {
        return <Link to={target}>{title}<br/></Link>
    } else if (thisPageIdx === currentPageIdx) {
        return <strong>{title}<br/></strong>
    } else {
        return <div>{title}<br/></div>
    }
}

var LinkToNext = function(props) {
    return <Link className="next-page" to={props.link}>{props.label}</Link>
}

var SpanToNext = function(props) {
    return <span className="next-page">{props.label}</span>
}

function valid(page, state) {
    console.log(state)
    const { interviewer, bio, survey } = state;
    if (page === "info") {
        return !!interviewer &&
            !!bio.gender &&
            !!bio.age &&
            !!bio.postcode
    } else if (page === "audit1") {
        for (var i = 0; i < 4; ++i) {
            if (!survey[i] || !survey[i].answer) {
                return false
            }
        }
    } else if (page === "audit2") {
        for (var i = 4; i < 10; ++i) {
            if (!survey[i] || !survey[i].answer) {
                return false
            }
        }
    }
    return true;
}

export default Footer;
