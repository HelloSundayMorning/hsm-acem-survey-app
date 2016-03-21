import React from 'react'
import { connect } from 'react-redux';
import Question from 'components/Question'
import * as bio from 'actions/bio'

var genderQuestion = {
    text: 'Gender:',
    key: 'gender',
    answers: [
        {key: 'male', text: 'Male'},
        {key: 'female', text: 'Female'},
        {key: 'other', text: 'Other'}
    ]
}

var PatientBio = React.createClass({
    handleChange(input) {
        this.props.update(input.value, input.name)
    },
    render() {
        return (
            <section id='patient-bio'>
                <h1>Patient Information</h1>
                <Question q={genderQuestion} onChange={this.handleChange} value={this.props.bio.gender}  />
                <label className='simple-input'>Age (must be between 12 and 110): <input type='number' min='12' max ='110' name='age' value={this.props.bio.age} onChange={event => this.handleChange(event.target)}/></label>
                <label className='simple-input'>Postcode: <input type='number' name='postcode' value={this.props.bio.postcode} onChange={event => this.handleChange(event.target)}/></label>
                <label className='simple-input'>Patient email (optional): <input type='email' name='email' value={this.props.bio.email} onChange={event => this.handleChange(event.target)}/></label>
                <label className='simple-input'>Patient mobile (optional): <input type='tel' name='phone' value={this.props.bio.phone}  onChange={event => this.handleChange(event.target)}/></label>
            </section>
        )
    }
});

export default connect(
    ({ bio }) => ({ bio }),
    { update: bio.bio.action }
)(PatientBio);
