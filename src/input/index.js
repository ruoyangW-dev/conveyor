import { inputTypes } from '../consts'
import * as R from 'ramda'
import {
  InputDate,
  InputDateTime,
  InputColor,
  InputString,
  InputPassword,
  InputInt,
  InputCurrency,
  InputTextArea,
  InputRadio,
  InputFile,
  InputSwitch,
  InputCheckbox,
  InputSelect,
  InputCreatableStringSelect
} from './inputComponent'

export const isAutoFocusInput = (type) => {
  switch (type) {
    case inputTypes.STRING_TYPE:
    case inputTypes.TEXTAREA_TYPE:
    case inputTypes.EMAIL_TYPE:
    case inputTypes.URL_TYPE:
    case inputTypes.PHONE_TYPE:
    case inputTypes.PASSWORD_TYPE:
    case inputTypes.INT_TYPE:
    case inputTypes.CURRENCY_TYPE:
      return true
    default:
      return false
  }
}

const defaultTypeMap = {
  [inputTypes.STRING_TYPE]: InputString,
  [inputTypes.EMAIL_TYPE]: InputString,
  [inputTypes.PHONE_TYPE]: InputString,
  [inputTypes.URL_TYPE]: InputString,
  [inputTypes.TEXTAREA_TYPE]: InputTextArea,
  [inputTypes.INT_TYPE]: InputInt,
  [inputTypes.CURRENCY_TYPE]: InputCurrency,
  [inputTypes.PASSWORD_TYPE]: InputPassword,
  [inputTypes.DATE_TYPE]: InputDate,
  [inputTypes.DATETIME_TYPE]: InputDateTime,
  [inputTypes.COLOR_TYPE]: InputColor,
  [inputTypes.FILE_TYPE]: InputFile,
  [inputTypes.RADIO_TYPE]: InputRadio,
  [inputTypes.SELECT_TYPE]: InputSelect,
  [inputTypes.CREATABLE_STRING_SELECT_TYPE]: InputCreatableStringSelect,
  [inputTypes.CHECKBOX_TYPE]: InputCheckbox,
  [inputTypes.BOOLEAN_TYPE]: InputSwitch
}
/**
 * @param { object } props
 * { string } **type** - One of following type designators:
 *      Int, TextArea, String, Password, Date, File, Radio, Select, Checkbox, Boolean,
 *      Email, Phone, URL, Currency. \
 * { string } **id** - Unique input id \
 * { any } **value** - Display value. Default: varies with type. Date value
 *      can be a moment object or a string. \
 * { string } **dateFormat** - Optional value for the DateInput/DateTimeInput component.
 *      Default: 'YYYY-MM-DD' or 'YYYY-MM-DD HH:mm'. Date value as a string should be consistent with
 *      dateFormat See moment.js for other format types \
 * { string } **timeFormat** - Optional value for the DateTimeInput component.
 *      Default: 'HH:mm'. Time value as a string should be consistent with
 *      timeFormat See moment.js for other format types \
 * { string } **labelStr** - String used for built-in <label> component.
 *      Not available for "Boolean" type \
 * { function } **onChange \
 * { boolean } **inline** - Only used for "Radio" type to signify inline
 *      capability. Default: false \
 * { any } **options** - Required for "Radio" and "Select" type. For "Select",
 *      if options is left undefined, the parameter "noOptionsMessage" dictates
 *      the drop down message to be given to the user instead of the options.
 *      Options must be an array of "label"/"value" pairs:
 *          [{label: "Hello", value: "hello"}, {label: "World", value: "world"}] \
 * { string } **className** - Component css class. Default: varies with type. \
 * { boolean } **isClearable** - Signifies that "Select" and "Date"
 *      type input components can be cleared of data. Default: true. See
 *      documentation of React Select for more information. \
 * { boolean } **isMulti** - Signifies that multiple options can be chosen
 *      for a "Select" type component. Default: false. See documentation of
 *      React Select for more information. \
 * { function } **noOptionsMessage** - "Select" component drop down message
 *      displayed if no options available. Default: () => 'No Options'. See
 *      documentation of React Select for more information. \
 * { function } **onMenuOpen** - Required for "Select" component to demonstrate
 *      behavior necessary when drop down menu is opened. See documentation of
 *      React Select for more information. \
 * { list } **error** - List of error messages to be displayed. If provided,
 *      component class contains the string 'is-invalid' and message is
 *      displayed in red. For the following types: "File", "TextArea", "Int",
 *      "Password", "String", "Boolean", "Checkbox", "Select", "Date", "Radio". \
 * { boolean } **required** - appends  '*' to the end of a label to indicate
 *      that the field is required. Not available for "Boolean" type \
 * { object } **customInput** - Overrides any props passed into the component,
 *      or those set by default in this library. For example, to override default
 *      settings for a "Date" component structure the data like so:
 *      {placeholderText:'Click here', fixedHeight:false} \
 * { object } **customError** - custom component that takes in an argument
 *      'error' and 'id' and returns an html component in to be displayed below the field \
 * { object } **customLabel** - custom label to be displayed above the filed
 *      not available for 'Checkbox' type \
 * { boolean } **autoFocus** - refers to specific fields (see isAutoFocusInput()) that have
 *      autofocus input feature \
 * { boolean } **spellCheck** - adds spell checking to the input box. Available for "String" and "TextArea" types. \
 * { boolean } **useUTC** - Optional value for the DateTimeInput component. Determines if UTC conversions should
 *      be made or not. \
 *
 * @returns { object } - Single input component
 */
const FlexibleInput = (props) => {
  const params = { ...props }

  switch (params.type) {
    case inputTypes.STRING_TYPE:
    case inputTypes.TEXTAREA_TYPE:
      params['spellCheck'] = R.defaultTo(true, params['spellCheck'])
      params['value'] = R.defaultTo('', params['value'])
      params['className'] = R.defaultTo('form-control', params['className'])
      break
    case inputTypes.EMAIL_TYPE:
    case inputTypes.PHONE_TYPE:
    case inputTypes.URL_TYPE:
    case inputTypes.INT_TYPE:
    case inputTypes.PASSWORD_TYPE:
    case inputTypes.CURRENCY_TYPE:
      params['value'] = R.defaultTo('', params['value'])
      params['className'] = R.defaultTo('form-control', params['className'])
      break
    case inputTypes.COLOR_TYPE:
      params['value'] = R.defaultTo('#ffffff', params['value'])
      break

    case inputTypes.DATE_TYPE:
      params['dateFormat'] = R.defaultTo('yyyy/MM/dd', params['dateFormat'])
      params['isClearable'] = R.defaultTo(true, params['isClearable'])
      break

    case inputTypes.DATETIME_TYPE:
      params['dateFormat'] = R.defaultTo(
        'yyyy/MM/dd HH:mm',
        params['dateFormat']
      )
      params['timeFormat'] = R.defaultTo('HH:mm', params['timeFormat'])
      params['isClearable'] = R.defaultTo(true, params['isClearable'])
      params['useUTC'] = R.defaultTo(true, params['useUTC'])
      break

    case inputTypes.FILE_TYPE:
      params['className'] = R.defaultTo(
        'form-control-file',
        params['className']
      )
      break

    case inputTypes.RADIO_TYPE:
      params['inline'] = R.defaultTo(false, params['inline'])
      params['className'] = R.defaultTo('form-check', params['className'])
      break

    case inputTypes.SELECT_TYPE:
      params['className'] = R.defaultTo('basic-single', params['className'])
      params['isClearable'] = R.defaultTo(true, params['isClearable'])
      params['isMulti'] = R.defaultTo(false, params['isMulti'])
      params['noOptionsMessage'] = R.defaultTo(
        () => 'No Options',
        params['noOptionsMessage']
      )
      break

    case inputTypes.CHECKBOX_TYPE:
      params['value'] = R.defaultTo(false, params['value'])
      params['className'] = R.defaultTo(
        'form-group form-check',
        params['className']
      )
      break

    case inputTypes.BOOLEAN_TYPE:
      params['value'] = R.defaultTo(false, params['value'])
      params['className'] = R.defaultTo('form-check', params['className'])
      params['inline'] = R.defaultTo(true, params['inline'])
      break
  }

  if (typeof params['error'] === 'string') {
    params['error'] = [params['error']]
  }

  return defaultTypeMap[params.type](params)
}

export default FlexibleInput
