import * as R from 'ramda'
import { schema } from '../__tests__/__mocks__/mock_data/schema'
//import { isFieldEditable, isDeletable, isCreatable } from '../src/Utils'
//import getDisplayValue from '../src/utils/getDisplayValue'
// Tests
describe('isFieldEditable function', () => {
  // _isFieldEditable shows "id" defaults to true
  it('Return fieldName != "id" w/ editable=UNDEFINED', () => {
    expect(
      schema.isFieldEditable({
        modelName: 'DefaultsTest',
        fieldName: 'id'
      })
    ).toBe(true)
    expect(
      schema.isFieldEditable({
        modelName: 'DefaultsTest',
        fieldName: 'name'
      })
    ).toBe(false)
  })

  it('Return editable w/ editable=DEFINED', () => {
    expect(
      schema.isFieldEditable({
        modelName: 'PredefinedTest',
        fieldName: 'id'
      })
    ).toBe(true)
    expect(
      schema.isFieldEditable({
        modelName: 'PredefinedTest',
        fieldName: 'name'
      })
    ).toBe(false)
    // editable: () => true
    expect(
      schema.isFieldEditable({
        modelName: 'PredefinedTest',
        fieldName: 'foo'
      })
    ).toBe(true)
  })

  it('Return false w/ editable=NOT FUNC OR BOOLEAN', () => {
    expect(
      schema.isFieldEditable({
        modelName: 'PredefinedTest',
        fieldName: 'bar'
      })
    ).toBe(false)
  })
})

describe('isDeletable function', () => {
  // _isDeletable defaults to false if not defined
  it('Return false w/ deletable=UNDEFINED', () => {
    expect(
      schema.isDeletable({
        modelName: 'DefaultsTest'
      })
    ).toBe(false)
  })

  it('Return deletable w/ deletable=DEFINED', () => {
    expect(
      schema.isDeletable({
        modelName: 'PredefinedTest'
      })
    ).toBe(false)
    // deletable: () => false
    expect(
      schema.isDeletable({
        modelName: 'ValidCasesTest'
      })
    ).toBe(false)
  })
  
  it('Return false w/ deletable=NOT FUNC OR BOOLEAN', () => {
    expect(
      schema.isDeletable({
        modelName: 'InvalidCasesTest'
      })
    ).toBe(false)
  })
})

describe('isCreatable function', () => {
  // _isCreatable returns false if not boolean or function
  it('Return false w/ creatable=UNDEFINED', () => {
    expect(
      schema.isCreatable({
        modelName: 'DefaultsTest'
      })
    ).toBe(false)
  })

  it('Return creatable w/ creatable=DEFINED', () => {
    expect(
      schema.isCreatable({
        modelName: 'PredefinedTest'
      })
    ).toBe(false)
    // creatable: () => false
    expect(
      schema.isCreatable({
        modelName: 'PredefinedTest'
      })
    ).toBe(false)
  })

  it('Return false w/ creatable=NOT FUNC OR BOOLEAN', () => {
    expect(
      schema.isCreatable({
        modelName: 'InvalidCasesTest'
      })
    ).toBe(false)
  })
})

describe('getDisplayValue function', () => {
  it('Return "name" w/ displayField=UNDEFINED', () => {
    expect(
      schema.getDisplayValue({
        modelName: 'DefaultsTest',
        node: { name: 'name' }
      })
    ).toBe('name')
  })

  it('Return displayField w/ displayField=DEFINED', () => {
    expect(
      schema.getDisplayValue({
        modelName: 'PredefinedTest',
        node: { foo: 'foo' }
      })
    ).toBe('foo')
    // displayField: () => 'bar'
    expect(
      schema.getDisplayValue({
        modelName: 'ValidCasesTest',
        node: { bar: 'bar' }
      })
    ).toBe('bar')
  })
})

describe('getFieldLabel function', () => {
  it('Return humanized fieldName w/ displayName=UNDEFINED', () => {
    expect(
      schema.getFieldLabel({
        modelName: 'DefaultsTest',
        fieldName: 'id'
      })
    ).toBe('Id')
    expect(
      schema.getFieldLabel({
        modelName: 'DefaultsTest',
        fieldName: 'name'
      })
    ).toBe('Name')
  })

  it('Return displayName w/ editable=DEFINED', () => {
    expect(
      schema.getFieldLabel({
        modelName: 'PredefinedTest',
        fieldName: 'id'
      })
    ).toBe('ID #')
    expect(
      schema.getFieldLabel({
        modelName: 'PredefinedTest',
        fieldName: 'name'
      })
    ).toBe('Field Name')
    // displayName: () => 'foobar'
    expect(
      schema.getFieldLabel({
        modelName: 'PredefinedTest',
        fieldName: 'foo'
      })
    ).toBe('foobar')
  })
})

describe('getModelLabel function', () => {
  it('Return titleized and humanized modelName w/ displayName=UNDEFINED', () => {
    expect(
      schema.getModelLabel({
        modelName: 'DefaultsTest'
      })
    ).toBe('Defaults Test')
    expect(
      schema.getModelLabel({
        modelName: 'titleizeTest'
      })
    ).toBe('Titleize Test')
  })

  it('Return displayName w/ displayName=DEFINED', () => {
    expect(
      schema.getModelLabel({
        modelName: 'PredefinedTest'
      })
    ).toBe('Predefined Test')
    // displayName: () => 'Pre Test'
    expect(
      schema.getModelLabel({
        modelName: 'ValidCasesTest'
      })
    ).toBe('Pre Test')
  })
})

describe('getModelLabelPlural function', () => {
  it('Return pluralized and titleized modelName w/ displayNamePlural=UNDEFINED', () => {
    // Space between words
    expect(
      schema.getModelLabelPlural({
        modelName: 'DefaultsTest'
      })
    ).toBe('Defaults Tests')
    expect(
      schema.getModelLabelPlural({
        modelName: 'titleizeTest'
      })
    ).toBe('Titleize Tests')
  })

  it('Return displayNamePlural w/ displayNamePlural=DEFINED', () => {
    expect(
      schema.getModelLabelPlural({
        modelName: 'PredefinedTest'
      })
    ).toBe('Predefined Tests')
    // displayName: () => 'Pre Tests'
    expect(
      schema.getModelLabelPlural({
        modelName: 'ValidCasesTest'
      })
    ).toBe('Pre Tests')
  })
})

describe('getCreateFields function', () => {
  it('Return [fieldName which != "id"] w/ showCreate=UNDEFINED', () => {
    expect(
      schema.getCreateFields({
        modelName: 'DefaultsTest'
      })
    ).toStrictEqual(['name'])
  })

  it('Return [fieldName where showCreate == true] w/ showCreate=DEFINED BOOLEAN / FUNC', () => {
    expect(
      schema.getCreateFields({
        modelName: 'PredefinedTest'
      })
    ).toStrictEqual(['id'])
  })
})

describe('getDetailFields function', () => {
  it('Return [fieldName which != "id"] w/ showDetail=UNDEFINED', () => {
    expect(
      schema.getDetailFields({
        modelName: 'DefaultsTest'
      })
    ).toStrictEqual(['name'])
  })

  it('Return [fieldName where showDetail == true] w/ showDetail=DEFINED BOOLEAN / FUNC', () => {
    expect(
      schema.getDetailFields({
        modelName: 'PredefinedTest'
      })
    ).toStrictEqual(['id'])
  })
})

describe('getIndexFields function', () => {
  it('Return [] w/ showIndex=UNDEFINED for all fields', () => {
    expect(
      schema.getIndexFields({
        modelName: 'DefaultsTest'
      })
    ).toStrictEqual([])
  })

  it('Return [fieldName where showIndex == true] w/ showIndex=DEFINED BOOLEAN / FUNC', () => {
    expect(
      schema.getIndexFields({
        modelName: 'PredefinedTest'
      })
    ).toStrictEqual(['id', 'foo', 'bar'])
  })
})

describe('getTooltipFields function', () => {
  it('Return [] w/ showTooltip=UNDEFINED for all fields', () => {
    expect(
      schema.getTooltipFields({
        modelName: 'DefaultsTest'
      })
    ).toStrictEqual([])
  })
  it('Return [fieldName where showTooltip == true] w/ showTooltip=DEFINED BOOLEAN / FUNC', () => {
    expect(
      schema.getTooltipFields({
        modelName: 'PredefinedTest'
      })
    ).toStrictEqual([
      'id',
      'foo',
      'bar'
    ])
  })
})

describe('getHasIndex function', () => {
  it('Return true w/ hasIndex=UNDEFINED', () => {
    expect(schema.getHasIndex('DefaultsTest')).toBe(true)
  })
  // Requires conveyor-schema changes
  it('Return hasIndex w/ hasIndex=DEFINED', () => {
    expect(schema.getHasIndex('PredefinedTest')).toBe(false)
  })
  it('Return hasIndex w/ hasIndex=DEFINED', () => {
    expect(schema.getHasIndex('ValidCasesTest')).toBe(true)
  })
})
