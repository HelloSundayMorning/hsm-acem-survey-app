import React from 'react'
import { connect } from 'react-redux';
import Question from 'components/Question'
import * as bio from 'actions/bio'
import { validateBioField } from 'src/validations'

var genderQuestion = {
    text: 'Gender:',
    key: 'gender',
    answers: [
        {key: 'male', text: 'Male'},
        {key: 'female', text: 'Female'},
        {key: 'other', text: 'Other'}
    ]
};

const bioInputFields = [
    { name: 'age', type: 'number', label: 'Age (must be between 12 and 110):' },
    { name: 'postcode', type: 'number', label: 'Postcode:' },
    { name: 'email', type: 'email', label: 'Patient email (optional):' },
    { name: 'phone', type: 'tel', label: 'Patient mobile (optional):' }
];

const Input = ({ label, type, value, onChange, valid }) => {
    let classNames = ['simple-input']
    if (!valid) {
        classNames.push('invalidate')
    }
    return (
        <label className={classNames.join(' ')}>
            {label}
            <input
                type={type}
                value={value}
                onChange={onChange}
            />
        </label>
    )
};

var PatientBio = React.createClass({
    handleChange(input) {
        this.props.update(input.value, input.name)
    },
    changeField(field) {
        return event => this.handleChange({ value: event.target.value, name: field });
    },
    validates(field) {
        return validateBioField(field, this.props.bio[field]);
    },
    render() {
        return (
            <section id='patient-bio'>
                <h1>Patient Information</h1>
                <Question q={genderQuestion} onChange={this.handleChange} value={this.props.bio.gender}  />
                {bioInputFields.map(field => <Input
                                                 key={field.name}
                                                 label={field.label}
                                                 value={this.props.bio[field.name]}
                                                 type={field.type}
                                                 onChange={this.changeField(field.name)}
                                                 valid={this.validates(field.name)}
                                             />)}
            </section>
        )
    }
});

export default connect(
    ({ bio }) => ({ bio }),
    { update: bio.bio.action }
)(PatientBio);
