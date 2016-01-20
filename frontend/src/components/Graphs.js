import { drinkPercentage, surveyAggregates } from 'src/surveyResults'

const riskFactor = {
    0: '0,1|0,1', // 0-2 = 1x
    1: '0,3|0,2', // 3-4 = 2x
    2: '0,5|0,3', // 5-6 = 3x
    3: '0,7|0,4', // 7-8,9 = 4x (survey has 7-9 but table breaks into 7-8 @ 4x & 9 @ 6x)
    4: '0,10|0,7' // 10+ = 7x
}

const defaults = [
    `chs=230x200` // Size
]

function auditScoreGraphLink(score) {
    const { average, recommended, max } = surveyAggregates

    const rangeMax = max + 5 // Top value of the graph
    const data = [
        `cht=bvs`, // Column chart
        `chbh=r,1.0`, // Column spacing
        `chds=0,${rangeMax}`, // Scale the Y values
        `chd=t:${average},${score}`, // data
        `chxl=0:|Average|You|1:|Recomm.+Max|Score+Max`, // Axis labels
        `chxt=x,y`, // Show x and y axes
        `chxr=1,0,${rangeMax}`, // Scale Y axis
        `chxp=1,${recommended},${max}`, // Axis label position
        `chxtc=1,-500`, // Axis tick length
        `chxs=0,,16|1,,16`, // Axis Label format
        `chma=0,0,0,53` // LRTB Margins, RiskFactor has a double axis label at bottom, so compensate with bigger bottom margin
    ]
    return link(data)
}

function frequencyGraphLink(age, gender, dailyScore) {
    const percentage = drinkPercentage(age, gender, dailyScore)/100

    const data = [
        `cht=p`, // Pie chart
        `chd=t:${percentage},${1-percentage}`, // Data
        `chdl=Less+than+you|More+than+you`, // Data labels
        `chdlp=b`, // Legend position
        `chp=-1.571`, // Initial angle (Pi/2)
        `chdls=,16` // Legend style
    ]
    return link(data)
}

function riskFactorGraphLink(dailyScore) {
    const data = [
        `cht=lxy`, // X-Y line
        `chxt=x,y,x,y`, // Axes displayed: 2 & 3 (0-based) are for axis labels
        `chls=3`, // Line style

        // Series 0 is static data of risk factor graph
        // Series 1 is a fake point, then the risk factor point for the daily score
        `chd=t:1,3,5,7,9,10|1,2,3,4,6,7|${riskFactor[dailyScore]}`,

        `chds=1,10,1,7,1,10,1,7`, // Data scales
        `chxr=0,1,10,2|1,1,7,1`, // Axis ranges
        `chm=x,FF0000,1,1,20`, // score mark formatting
        `chxs=0,,16|1N**x,,16|2,,16|3,,16`, // Axis Label format
        `chxl=0:|2|4|6|8||10%2B|2:|%23+of+drinks+consumed|3:|Risk`, // Axis labels
        `chxp=2,50|3,50`, // Axis Label position
        `chma=0,10,10,0` // LRTB Margins, give a margin at top right for when the X is in the corner
    ]
    return link(data)
}

function link(params) {
    return `https://chart.googleapis.com/chart?${defaults.concat(params).join('&')}`
}

export {
    auditScoreGraphLink,
    frequencyGraphLink,
    riskFactorGraphLink
}
