import React, { Component } from 'react';
import { render } from "react-dom";
import { Wizard } from "./lib";

import './app.css'

const config = {
    steps: [
        {
            name: 'step1', 
            title: '① Getting Aquainted',            
            sections: [
                { 
                    name: 'personal', 
                    caption: 'Personal Details',
                    description: 'Tell us a little bit about yourself!',
                    fields: [
                        { name: 'firstname', label: 'Firstname', component: 'input', validity: 'required', hint: 'Enter your firstname' },
                        { name: 'lastname', label: 'Lastname', component: 'input', validity: 'required' }
                    ],
                    required: ['firstname', 'lastname']
                },
                { 
                    name: 'details', 
                    caption: 'Misc Details',
                    fields: [
                        { name: 'age', label: 'Age', component: 'input', validate: '^[0-9]+$', validity: 'pattern' },
                        { name: 'gender', label: 'Gender', component: 'select', validity: 'required', options: [ {text: 'Male', value: 'male'}, {text: 'Female', value: 'female'}] },
                        { name: 'income', label: 'Yearly Income', component: 'range', min: 1, max: 500000, defaultValue: 50000}
                    ],
                    required: ['age', 'gender']
                }
            ]
        }, {
            name: 'step2', 
            title: '➁ Getting Connected',
            sections: [
                { 
                    name: 'contact', 
                    caption: 'Contact Details',
                    fields: [
                        { name: 'email', label: 'Email', component: 'email', validate: '(.+)@(.+){2,}\\.(.+){2,}', validity: 'pattern' },
                        { name: 'emailType', label: 'Email Account Type', component: 'radiolist', options: [ {value: 'personal', text: 'Personal'}, { value: 'business', text: 'Business'} ], validity: 'required' }
                    ],
                    required: ['email', 'emailType']
                }
            ]
        }
    ],
    validity: {
        required: {
            age: 'Please enter your age',
            firstname: 'Please enter your firstname!',
            lastname: 'Please enter your lastname!',
            gender: 'Please select a gender!',
            emailType: 'Please select an email account type!'
        },
        pattern: {
            age: 'Please enter a valid age!',
            email: 'Please enter a valid email address!'
        }
    }    
}
const i18n = {
    'actions.next': 'Continue ⟶',
    'actions.finish': 'Complete ⟶',
    'actions.previous': '⟵ Go Back',
    'labels.firstname': 'Firstname *',
    'labels.lastname': 'Lastname *'
}

// Custom inputs
const Box = ({value}) => (<div className="box">{value}</div>)

const factory = (name) => {
    return {
    'box': Box
    }[name]
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            results: {},
            isValid: true,
            showResults: false
        }
        this.wizardRef = null
    }

    handleSubmit(results) {
        this.setState({results: results.data, showResults: true})
    }

    handleReset() {
        this.wizardRef.goToStep(0)
        this.setState({results: {}, showResults: false})
    }

    handleValidate(valid) {
        this.setState({isValid: valid})
    }

    render() {
        const { results } = this.state
        return  (
            <div style={{ margin: "15px auto" }} className={!this.state.isValid ? 'invalid' : ''}>
              <div style={{display: this.state.showResults ? 'none' : 'block'}}>
                  <Wizard ref={c => this.wizardRef = c} config={config} onValidated={this.handleValidate.bind(this)} onSubmit={this.handleSubmit.bind(this)} componentFactory={factory} i18n={i18n} />
              </div>
              {this.state.showResults && <div className="wizard__results">
                  <h1>🖒 Thank you {results.firstname}!</h1>
                  <ul style={{textAlign: 'left'}}>
                      <li>Name: {results.firstname} {results.lastname}</li>
                      <li>Gender: {results.gender}</li>
                      <li>Age: {results.age}</li>
                      <li>Email: {results.email} ({results.emailType})</li>
                      <li>Yearly Income: ${results.income}</li>
                  </ul>
                  <button onClick={this.handleReset.bind(this)}>⟵ Start Over</button>
              </div>}
            </div>
          )
    }
}


render(<App />, document.getElementById("root"));
