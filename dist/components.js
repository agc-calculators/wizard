function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
export const Input = ({
  name,
  defaultValue,
  onChange,
  type,
  ...props
}) => React.createElement("input", _extends({
  type: type || 'text',
  name: name,
  defaultValue: defaultValue,
  onChange: e => onChange && onChange(e.target.value)
}, props));
export const Number = ({
  name,
  defaultValue,
  onChange,
  ...props
}) => React.createElement("input", _extends({
  type: "number",
  name: name,
  defaultValue: defaultValue,
  onChange: e => onChange && onChange(e.target.value)
}, props));
export const Email = ({
  name,
  defaultValue,
  onChange,
  ...props
}) => React.createElement("input", _extends({
  type: "email",
  name: name,
  defaultValue: defaultValue,
  onChange: e => onChange && onChange(e.target.value)
}, props));
export const Radio = ({
  name,
  value,
  defaultChecked,
  onChange
}) => React.createElement("input", {
  type: "radio",
  name: name,
  value: value,
  defaultChecked: defaultChecked,
  onChange: onChange
});
export const Select = ({
  name,
  options,
  selected,
  onChange
}) => React.createElement("select", {
  name: name,
  defaultValue: selected,
  onChange: e => onChange && onChange(e.target.value)
}, (options || []).map(opt => React.createElement("option", {
  key: opt.value,
  value: opt.value
}, opt.text)));
export const Range = ({
  name,
  defaultValue,
  onChange,
  ...props
}) => React.createElement("input", _extends({
  type: "range",
  name: name,
  defaultValue: defaultValue,
  onChange: e => onChange && onChange(e.target.value)
}, props));
export const RadioList = ({
  options,
  name,
  value
}) => React.createElement("div", {
  className: "wizard__RadioList"
}, (options || []).map((opt, idx) => React.createElement("label", {
  key: `option${idx}`
}, React.createElement("input", {
  type: "radio",
  name: name,
  value: opt.value,
  defaultChecked: value === opt.value
}), " ", opt.text)));
export const CheckList = ({
  options,
  name,
  value
}) => React.createElement("div", {
  className: "wizard__CheckList"
}, (options || []).map((opt, idx) => React.createElement("label", {
  key: `option${idx}`
}, React.createElement("input", {
  type: "checkbox",
  name: name,
  value: opt.value,
  defaultChecked: value.indexOf(opt.value) !== -1
}), " ", opt.text)));
export const Textarea = ({
  name,
  value
}) => React.createElement("textarea", {
  name: name
}, value);