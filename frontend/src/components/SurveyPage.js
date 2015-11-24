"use strict";

import React from 'react'
import Footer from "components/Footer"

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

export default SurveyPage
