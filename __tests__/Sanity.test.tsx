import React from 'react'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import FlexibleInput from '../src/input/index'
import { inputTypes } from '../src/consts'

configure({ adapter: new Adapter() })

// Mount component
const setupFlexibleInput = (props: any) => {
  const wrapper = mount(<FlexibleInput {...props} />)

  return { props, wrapper }
}

// Tests
describe('FlexibleInput component', () => {
  it('InputDate w/ type=DATE_TYPE w/ defaulted props', () => {
    const { wrapper } = setupFlexibleInput({ type: inputTypes.DATE_TYPE })
    expect(wrapper.find('.date-picker-container')).toHaveLength(1)
    expect(
      wrapper.find('.date-picker-container').childAt(0).prop('isClearable')
    ).toBe(true)
  })
})