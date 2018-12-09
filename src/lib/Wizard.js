import React, { Component } from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

import serialize from './serialize'

import "./Wizard.css"

import { Input, Radio, Select, Textarea, Email, Number, RadioList, CheckList, Range } from "./components"

const stringToComponentMapper = {
    input: Input,
    email: Email,
    number: Number,
    radio: Radio,
    radiolist: RadioList,
    checklist: CheckList,
    select: Select,
    textarea: Textarea,
    range: Range
}

const maybeFactory = (factory, component) => {
  let comp = factory && factory(component)
  
  if (!comp || typeof comp !== 'function') {
    return stringToComponentMapper[component]
  }
  return comp
}

const Field = ({name, label, hint, className, component, value, defaultValue, defaultChecked, selected, options, onChange, required, validate, validity, onBlur, min, max}) => 
    (<div className={className} data-field={name} data-validate={validate ? true : (required ? true : false)} data-pattern={validate} data-validity={validity} data-required={required} onBlur={onBlur}>
        {!component.label && label && (<label htmlFor={name}>{label}</label>)}
        {component.label && component.label(label)}
        {component && component({name, label, value, defaultValue, selected, defaultChecked, options, onChange, min, max})}
        {hint && <p className="wizard__field-hint">{hint}</p>} 
        <div className="wizard__validation-message"></div>      
    </div>)

const FormSection = ({name, className, caption, description, children}) => (
    <div className={className} id={`formSection_${name}`}>
            {caption && (<h3 className={`${className}-title`}>{caption}</h3>)}
            {description && (<p className={`${className}-description`}>{description}</p>)}
            {children}
    </div>
)

class Wizard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cache: {},
            totalSteps: 0,
            currentIndex: 0,
            canSubmit: false,
            isValid: false
        }
        this.goToStep = this.goToStep.bind(this)
        this.prevStep = this.prevStep.bind(this)
        this.nextStep = this.nextStep.bind(this)
        this.validateSteps = this.validateSteps.bind(this)
        this.translate = this.translate.bind(this)
    }

    static propTypes = {
        config: PropTypes.shape({
            steps: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string,
                title: PropTypes.string,
                sections: PropTypes.arrayOf(PropTypes.shape({
                    name: PropTypes.string,
                    caption: PropTypes.string,
                    fields: PropTypes.arrayOf(PropTypes.shape({
                        name: PropTypes.string,
                        label: PropTypes.string,
                        component: PropTypes.string
                    }))
                }))
            }))            
        }).isRequired,
        componentFactory: PropTypes.func,
        onSubmit: PropTypes.func,
        onStepChanged: PropTypes.func,
        onValidated: PropTypes.func,
        onReady: PropTypes.func,
        i18n: PropTypes.shape()     
    }

    translate(key) {
        const { i18n } = this.props
        if (!i18n || typeof i18n[key] === 'undefined') return null
        return i18n[key]
    }

    goToStep(index) {
        var i, dots = this.rootEl.querySelectorAll(".wizard__progress span");

        if (index === 0) {
            this.setState({canSubmit: false, isValid: false});
        }

        if (this.state.isValid && index + 1 === this.state.totalSteps) {
            for (i = 0; i < dots.length; i++) {
                dots[i].classList.remove('active')
                dots[i].classList.add('finish')
            }

            this.props.onValidated && this.props.onValidated(true)
            this.props.onStepChanged && this.props.onStepChanged(index)
            this.props.onSubmit && this.props.onSubmit(serialize(this.rootEl.querySelector('form')))
            // setTimeout(() => {
            //     this.rootEl.querySelector('form').submit()
            // }, 0)            
            return;
        }

        // This function will display the specified tab of the form...
        var steps = this.rootEl.getElementsByClassName("wizard__step");

        Array.from(steps).forEach(s => {
            s.style.display = 'none'
        });

        steps[index].style.display = "block";

        //... and fix the Previous/Next buttons:
        if (index === 0) {
            this.rootEl.querySelector("#wizPrevBtn").style.display = "none";
        } else {
            this.rootEl.querySelector("#wizPrevBtn").style.display = "inline";
        }

        if (index === (steps.length - 1)) {
            this.rootEl.querySelector("#wizNextBtn").innerHTML = this.translate('actions.submit') || "Submit";
        } else {
            this.rootEl.querySelector("#wizNextBtn").innerHTML = this.translate('actions.next') || "Next";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].classList.remove('active')
        }

        dots[index].classList.add('active');
        
        if (index > 0) {
            dots[index - 1].classList.add('finish')
        }

        this.setState({currentIndex: index, canSubmit: index >= (steps.length - 1)})
        this.props.onStepChanged && this.props.onStepChanged(index)
    }

    prevStep(e) {
        e.preventDefault()
        let index = this.state.currentIndex - 1
        this.setState({isValid: false, canSubmit: false})
        if (index >= 0) {
            this.goToStep(index)
        } else {
            this.goToStep(0)
        }
    }

    nextStep(e) {
        e.preventDefault()

        let index = this.state.currentIndex + 1

        if (!this.validateSteps(this.state.canSubmit ? index : this.state.currentIndex)) {
            this.setState({isValid: false})
            this.props.onValidated && this.props.onValidated(false)
            return;
        }

        this.setState({isValid: true})

        let totalSteps = this.state.totalSteps
        if (index < totalSteps) {
            this.goToStep(index)
        } else {
            this.goToStep(totalSteps - 1)
        }
    }

    render() {
        const { config, componentFactory, onSubmit } = this.props
        const { steps } = config
        
        return (
            <div className="wizard">
                <form onSubmit={onSubmit}>
                    {steps.map((step, idx) => (
                    <div className="wizard__step" key={step.name} data-step-index={idx}>
                        {step.title && <h3 className="wizard__step-title">{this.translate(`steps.${step.name}.title`) || step.title}</h3>}
                        {step.sections.map(section => (
                            <FormSection key={section.name} className="wizard__step-section" name={section.name} 
                                 caption={this.translate(`sections.${section.name}.caption`) || section.caption}
                                 description={this.translate(`sections.${section.name}.description`) || section.description}>
                                {section.fields.map(f => (
                                    <Field className="wizard__field" 
                                        key={f.name} 
                                        name={f.name} 
                                        label={this.translate(`labels.${f.name}`) || f.label} 
                                        hint={this.translate(`hints.${f.name}`) || f.hint}
                                        required={(section.required || []).indexOf(f.name) !== -1} 
                                        validate={f.validate} 
                                        validity={f.validity} 
                                        component={maybeFactory(componentFactory, f.component)} 
                                        options={f.options}
                                        defaultValue={f.defaultValue}
                                        defaultChecked={f.defaultChecked}
                                        min={f.min}
                                        max={f.max}
                                        onBlur={() => this.validateInput(f.name)} />
                                ))}
                            </FormSection>
                        ))}
                    </div>))}
                    <div className="wizard__actions">
                        <button type="button" id="wizPrevBtn" onClick={this.prevStep}>{this.translate('actions.previous') || 'Previous'}</button>
                        <button type="button" id="wizNextBtn" onClick={this.nextStep}>{this.translate(this.state.canSubmit ? 'actions.finish' : 'actions.next') || 'Next'}</button>
                    </div>
                    <div className="wizard__progress">
                        {steps.map( (s, index) => (
                            <span key={index} title={s.caption}></span>
                        ))}
                    </div>
                </form>
            </div>
        )
    }

    validateInput(name) {
        let cached = this.state.cache[name]
        if (!cached) return

        let el = cached.el
        let messageEl = el.parentNode.querySelector('.wizard__validation-message');
        let data = serialize(this.rootEl.querySelector('form')).data
        let val = data[name]
        
        el.classList.remove('error')        

        // required
        if (cached.required && !val) {
            el.classList.add('error')
            return;
        }

        // pattern
        if (cached.regex) {
            if (!cached.regex.test(val)) {
                el.classList.add('error')
                return;
            }
        }

        if (!messageEl) return
        messageEl.textContent = ''
    }

    validateSteps(index) {
        let isValid = true
        let steps = this.rootEl.getElementsByClassName("wizard__step")

        let data = serialize(this.rootEl.querySelector('form')).data

        Array.from(steps).forEach( step => {
            let stepIndex = parseFloat(step.dataset['stepIndex'])
            if (stepIndex <= index) {
                let validations = step.querySelectorAll('[data-validate]');
                Array.from(validations).forEach( v => {
                    
                    let name = v.dataset['field']
                    let isRequired = !!v.dataset['required']
                    let messageEl = v.querySelector('.wizard__validation-message')

                    let cached = this.state.cache[name]
                    cached.el.classList.remove('error')
                    if (messageEl) messageEl.textContent = ''

                    let val = data[name]
                    let valid = true
                    if (cached.regex) {
                        valid = cached.regex.test(val)
                    }
                    if (isRequired && valid) {
                        valid = !!val
                    }

                    if (!valid) {
                        isValid = false
                        cached.el.classList.add('error')
                        if (messageEl) messageEl.textContent = cached.message
                    }                    
                })
            }
        })

        this.props.onValidated && this.props.onValidated(isValid)

        return isValid        
    }

    componentDidMount() {
        this.rootEl = ReactDOM.findDOMNode(this)
        const { config } = this.props
        const { steps, validity } = config

        this.setState({totalSteps: steps.length})
        this.goToStep(0)

        // build regex cache
        let cache = {}
        let validations = this.rootEl.querySelectorAll('[data-validate]');
        
        Array.from(validations).forEach(v => {
            let target = v.dataset['field']
            let r = v.dataset['pattern']
            let regex = r && new RegExp(r)
            let m = v.dataset['validity']
            let message = (validity && validity[m] && validity[m][target]) || 'This field is invalid!';
            let el = this.rootEl.querySelector(`[name=${target}]`)
            cache[target] = { regex: regex, el: el, message: message, required: !!v.dataset['required'] }
        })
        this.setState({cache: cache})
        this.props.onReady && this.props.onReady({steps: steps && steps.length || 0})
    }
}

export default Wizard