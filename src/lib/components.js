import React from 'react'

export const Input = ({name, defaultValue, onChange, type, ...props}) => (<input type={type || 'text'} name={name} defaultValue={defaultValue} onChange={(e) => onChange && onChange(e.target.value)} {...props} />)

export const Number = ({name, defaultValue, onChange, ...props}) => (<input type="number" name={name} defaultValue={defaultValue} onChange={(e) => onChange && onChange(e.target.value)} {...props} />)

export const Email = ({name, defaultValue, onChange, ...props}) => (<input type="email" name={name} defaultValue={defaultValue} onChange={(e) => onChange && onChange(e.target.value)} {...props} />)

export const Radio = ({name, value, defaultChecked, onChange}) => (<input type="radio" name={name} value={value} defaultChecked={defaultChecked} onChange={onChange} />)

export const Select = ({name, options, selected, onChange}) => (<select name={name} defaultValue={selected} onChange={(e) => onChange && onChange(e.target.value)}>{((options || []).map( opt => (<option key={opt.value} value={opt.value}>{opt.text}</option>)))}</select>)

export const Range = ({name, defaultValue, onChange, ...props}) => (<input type="range" name={name} defaultValue={defaultValue} onChange={(e) => onChange && onChange(e.target.value)} {...props} />)

export const RadioList = ({options, name, value}) => (<div className="wizard__RadioList">
    {(options || []).map( (opt, idx) => <label key={`option${idx}`}><input type="radio" name={name} value={opt.value} defaultChecked={value === opt.value} /> {opt.text}</label>)}
    </div>)

export const CheckList = ({options, name, value}) => (<div className="wizard__CheckList">
{(options || []).map( (opt, idx) => <label key={`option${idx}`}><input type="checkbox" name={name} value={opt.value} defaultChecked={value.indexOf(opt.value) !== -1} /> {opt.text}</label>)}
</div>)


export const Textarea = ({name, value}) => (<textarea name={name}>{value}</textarea>)