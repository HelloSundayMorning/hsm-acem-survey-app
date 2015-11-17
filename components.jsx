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
            {pageOrder.map(function(result) {
                var page = routeMap[result];
                return <span key={page}><Link className={"link-"+thisPage} to={result}>{page[1]}</Link><br /></span>
            })}
             <Link className="next-page" to={link}>{label}</Link>
            </footer>
        );
    }
});

module.exports = {
    SurveyPage: SurveyPage
}
