import React from 'react'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import FlexibleInput from '../src/input/index'
import { isAutoFocusInput } from '../src/input/index'
import { inputTypes } from '../src/consts'

configure({ adapter: new Adapter() })

// Mount component
const setupFlexibleInput = (props) => {
  const wrapper = mount(<FlexibleInput {...props} />)

  return { props, wrapper }
}

// Tests
describe('FlexibleInput component', () => {
  it('InputDate w/ type=DATE_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({ type: inputTypes.DATE_TYPE })
    expect(wrapper.find('.date-picker-container')).toHaveLength(1)
    expect(wrapper.find('.date-picker-container').childAt(0).prop('isClearable')).toBe(true)
  })
  it('InputString w/ type=STRING_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({ type: inputTypes.STRING_TYPE })
    expect(wrapper.find('input')).toHaveLength(1)
    expect(wrapper.find('input').prop('type')).toBe('text')
    expect(
      wrapper.find('input').prop('value') === '' &&
        wrapper.find('input').prop('className') === 'form-control'
    ).toBe(true)
  })
  it('InputString w/ type=EMAIL_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({ type: inputTypes.EMAIL_TYPE })
    expect(wrapper.find('input')).toHaveLength(1)
    expect(wrapper.find('input').prop('type')).toBe('email')
    expect(
      wrapper.find('input').prop('value') === '' &&
        wrapper.find('input').prop('className') === 'form-control'
    ).toBe(true)
  })
  it('InputString w/ type=PHONE_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({ type: inputTypes.PHONE_TYPE })
    expect(wrapper.find('input')).toHaveLength(1)
    expect(wrapper.find('input').prop('type')).toBe('tel')
    expect(
      wrapper.find('input').prop('value') === '' &&
        wrapper.find('input').prop('className') === 'form-control'
    ).toBe(true)
  })
  it('InputString w/ type=URL_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({ type: inputTypes.URL_TYPE })
    expect(wrapper.find('input')).toHaveLength(1)
    expect(wrapper.find('input').prop('type')).toBe('url')
    expect(
      wrapper.find('input').prop('value') === '' &&
        wrapper.find('input').prop('className') === 'form-control'
    ).toBe(true)
  })
  it('InputPassword w/ type=PASSWORD_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({ type: inputTypes.PASSWORD_TYPE })
    expect(wrapper.find('input')).toHaveLength(1)
    expect(wrapper.find('input').prop('type')).toBe('password')
    expect(
      wrapper.find('input').prop('value') === '' &&
        wrapper.find('input').prop('className') === 'form-control'
    ).toBe(true)
  })
  it('InputInt w/ type=INT_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({ type: inputTypes.INT_TYPE })
    expect(wrapper.find('input')).toHaveLength(1)
    expect(wrapper.find('input').prop('type')).toBe('number')
    expect(
      wrapper.find('input').prop('value') === '' &&
        wrapper.find('input').prop('className') === 'form-control'
    ).toBe(true)
  })
  it('InputCurrency w/ type=CURRENCY_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({ type: inputTypes.CURRENCY_TYPE })
    expect(wrapper.find('CurrencyInput')).toHaveLength(1)
    expect(
      wrapper.find('CurrencyInput').prop('value') === '' &&
        wrapper.find('CurrencyInput').prop('className') === 'form-control'
    ).toBe(true)
  })
  it('InputTextArea w/ type=TEXTAREA_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({ type: inputTypes.TEXTAREA_TYPE })
    expect(wrapper.find('textarea')).toHaveLength(1)
    expect(
      wrapper.find('textarea').prop('value') === '' &&
        wrapper.find('textarea').prop('className') === 'form-control'
    ).toBe(true)
  })
  it('InputRadio w/ type=RADIO_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({
      type: inputTypes.RADIO_TYPE,
      options: [{ label: 'test', value: 'false' }]
    })
    expect(wrapper.find('input')).toHaveLength(1)
    expect(wrapper.find('input').prop('type')).toBe('radio')
    expect(
      !wrapper.find('input').parent().hasClass('form-check-inline') &&
        wrapper.find('input').parent().hasClass('form-check')
    ).toBe(true)
  })
  it('InputFile w/ type=FILE_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({
      type: inputTypes.FILE_TYPE
    })
    expect(wrapper.find('input')).toHaveLength(1)
    expect(wrapper.find('input').prop('type')).toBe('file')
    expect(wrapper.find('input').hasClass('form-control-file')).toBe(true)
  })
  it('InputCheckbox w/ type=BOOLEAN_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({
      type: inputTypes.BOOLEAN_TYPE
    })
    expect(wrapper.find('MdCheckBoxOutlineBlank')).toHaveLength(1)
    expect(
      wrapper.exists('.form-check') &&
        wrapper.exists('.form-check-inline')
    ).toBe(true)
  })
  it('InputSelect w/ type=SELECT_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({
      type: inputTypes.SELECT_TYPE
    })
    expect(wrapper.find('Select')).toHaveLength(1)
    expect(
      wrapper.find('Select').prop('isClearable') === true &&
        wrapper.find('Select').prop('isMulti') === false &&
        wrapper.find('Select').prop('noOptionsMessage')() === 'No Options' &&
        wrapper.find('Select').hasClass('basic-single')
    ).toBe(true)
  })
  it('InputCreatableSelect w/ type=EXISTING_FIELD_SELECT_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({
      type: inputTypes.CREATABLE_STRING_SELECT_TYPE
    })
    expect(wrapper.find('Select')).toHaveLength(1)
    expect(
      wrapper.find('Select').prop('createOptionPosition') === 'first'
    ).toBe(true)
  })
  it('InputString·w/·type=STRING_TYPE·error=Example·Error', () => {
    const { wrapper } = setupFlexibleInput({
      type: inputTypes.STRING_TYPE,
      error: 'Example Error'
    })
    expect(wrapper.find('div').at(1).text()).toBe('Example Error')
  })
})

describe('isAutoFocusInput function', () => {
  it('return true w/ type=STRING_TYPE, TEXTAREA_TYPE, EMAIL_TYPE, URL_TYPE, PHONE_TYPE, PASSWORD_TYPE, INT_TYPE, CURRENCY_TYPE', () => {
    expect(isAutoFocusInput(inputTypes.STRING_TYPE)).toBe(true)
    expect(isAutoFocusInput(inputTypes.TEXTAREA_TYPE)).toBe(true)
    expect(isAutoFocusInput(inputTypes.EMAIL_TYPE)).toBe(true)
    expect(isAutoFocusInput(inputTypes.URL_TYPE)).toBe(true)
    expect(isAutoFocusInput(inputTypes.PHONE_TYPE)).toBe(true)
    expect(isAutoFocusInput(inputTypes.PASSWORD_TYPE)).toBe(true)
    expect(isAutoFocusInput(inputTypes.INT_TYPE)).toBe(true)
    expect(isAutoFocusInput(inputTypes.CURRENCY_TYPE)).toBe(true)
  })
  it('return false w/ any other type', () => {
    expect(isAutoFocusInput(inputTypes.DATE_TYPE)).toBe(false)
    expect(isAutoFocusInput(inputTypes.FILE_TYPE)).toBe(false)
    expect(isAutoFocusInput(inputTypes.RADIO_TYPE)).toBe(false)
    expect(isAutoFocusInput(inputTypes.SELECT_TYPE)).toBe(false)
    expect(isAutoFocusInput(inputTypes.CREATABLE_STRING_SELECT_TYPE)).toBe(false)
    expect(isAutoFocusInput(inputTypes.CHECKBOX_TYPE)).toBe(false)
    expect(isAutoFocusInput(inputTypes.BOOLEAN_TYPE)).toBe(false)
  })
})
