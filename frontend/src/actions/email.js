const emailToPatient = () => (dispatch, getState) => {
    const state = getState()
    const { bio: { email }} = state
    if (/@/.test(email)) {
        deliverEmail(state, email)
    } else {
        askAndDeliverEmail(state)
    }
}

const emailTo = () => (dispatch, getState) => {
    askAndDeliverEmail(getState())
}


function deliverEmail(state, email) {
    postEmail(email, state).then(response => {
        if (response.status < 400) {
            // FIXME Do what on success?
        } else {
            const error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }).catch(failure)
}

function failure(ex) {
    // FIXME Log this error into...?
}

function askAndDeliverEmail(state) {
    var res = window.prompt('Enter email address');
    if (res !== null) {
        deliverEmail(state, res);
    } // else user cancelled the prompt
}

function mapState(email, state) {
    return {
        Email: 'bodhi@theplant.jp',
        Template: 'low-risk',
        FrequencyChart: '<img src="https://chart.googleapis.com/chart?chs=250x200&amp;cht=p&amp;chd=t:0.14800000000000002,0.852&amp;chdl=Less+than+you|More+than+you&amp;chdlp=b&amp;chp=-1.571&amp;chdls=,16" data-reactid=".0.0.0.2.2.1">',
        RiskChart: '<img src="https://chart.googleapis.com/chart?chs=250x200&amp;cht=lxy&amp;chxt=x,y,x,y&amp;chls=3&amp;chd=t:1,3,5,7,9,10|1,2,3,4,6,7|0,1|0,1&amp;chds=1,10,1,7,1,10,1,7&amp;chxr=0,1,10,2|1,1,7,1&amp;chm=x,FF0000,1,1,20&amp;chxs=0,,16|1N**x,,16|2,,16|3,,16&amp;chxl=0:|2|4|6|8||10%2B|2:|Number+of+Drinks+Consumed|3:|Risk&amp;chxp=2,50|3,50&amp;chma=0,10,10,0" data-reactid=".0.0.0.2.1.1">',
        AuditChart: '<img src="https://chart.googleapis.com/chart?chs=250x200&amp;cht=bvs&amp;chbh=r,1.0&amp;chds=0,45&amp;chd=t:10,0&amp;chxl=0:|Average|You|1:|Recomm.+Max|Score+Max&amp;chxt=x,y&amp;chxr=1,0,45&amp;chxp=1,7,40&amp;chxtc=1,-500&amp;chxs=0,,16|1,,16&amp;chma=0,0,0,53" data-reactid=".0.0.0.2.0.1">'
    }
}

function postEmail(email, state) {
    return fetch(__API_URL__ + '/surveys/email', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mapState(state))
    })
}


export {
    emailToPatient,
    emailTo
}
