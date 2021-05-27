import * as R from 'ramda'
import { schema } from '../tests/__mocks__/mock_data/schema'
import { isFieldEditable, isDeletable, isCreatable } from '../src/Utils'
import getDisplayValue from '../src/utils/getDisplayValue'
import {
  getFieldLabel,
  getModelLabel,
  getModelLabelPlural,
  getCreateFields,
  getDetailFields,
  getIndexFields,
  getTooltipFields,
  getHasIndex
} from '../src/utils/schemaGetters'

// Tests
describe('isFieldEditable function', () => {
  it('Return fieldName != "id" w/ editable=UNDEFINED', () => {
    expect(
      isFieldEditable({
        schema: schema,
        modelName: 'DefaultsTest',
        fieldName: 'id'
      })
    ).toBe(false)
    expect(
      isFieldEditable({
        schema: schema,
        modelName: 'DefaultsTest',
        fieldName: 'name'
      })
    ).toBe(true)
  })

  it('Return editable w/ editable=DEFINED', () => {
    expect(
      isFieldEditable({
        schema: schema,
        modelName: 'PredefinedTest',
        fieldName: 'id'
      })
    ).toBe(true)
    expect(
      isFieldEditable({
        schema: schema,
        modelName: 'PredefinedTest',
        fieldName: 'name'
      })
    ).toBe(false)
    // editable: () => true
    expect(
      isFieldEditable({
        schema: schema,
        modelName: 'PredefinedTest',
        fieldName: 'foo'
      })
    ).toBe(true)
  })

  it('Return false w/ editable=NOT FUNC OR BOOLEAN', () => {
    expect(
      isFieldEditable({
        schema: schema,
        modelName: 'PredefinedTest',
        fieldName: 'bar'
      })
    ).toBe(false)
  })
})

describe('isDeletable function', () => {
  it('Return true w/ deletable=UNDEFINED', () => {
    expect(
      isDeletable({
        schema: schema,
        modelName: 'DefaultsTest'
      })
    ).toBe(true)
  })

  it('Return deletable w/ deletable=DEFINED', () => {
    expect(
      isDeletable({
        schema: schema,
        modelName: 'PredefinedTest'
      })
    ).toBe(false)
    // deletable: () => false
    expect(
      isDeletable({
        schema: R.assocPath(
          ['PredefinedTest', 'deletable'],
          () => false,
          schema
        ),
        modelName: 'PredefinedTest'
      })
    ).toBe(false)
  })

  it('Return false w/ deletable=NOT FUNC OR BOOLEAN', () => {
    expect(
      isDeletable({
        schema: R.assocPath(['PredefinedTest', 'deletable'], 42, schema),
        modelName: 'PredefinedTest'
      })
    ).toBe(false)
  })
})

describe('isCreatable function', () => {
  it('Return true w/ creatable=UNDEFINED', () => {
    expect(
      isCreatable({
        schema: schema,
        modelName: 'DefaultsTest'
      })
    ).toBe(true)
  })

  it('Return creatable w/ creatable=DEFINED', () => {
    expect(
      isCreatable({
        schema: schema,
        modelName: 'PredefinedTest'
      })
    ).toBe(false)
    // creatable: () => false
    expect(
      isCreatable({
        schema: R.assocPath(
          ['PredefinedTest', 'creatable'],
          () => false,
          schema
        ),
        modelName: 'PredefinedTest'
      })
    ).toBe(false)
  })

  it('Return false w/ creatable=NOT FUNC OR BOOLEAN', () => {
    expect(
      isCreatable({
        schema: R.assocPath(['PredefinedTest', 'creatable'], 42, schema),
        modelName: 'PredefinedTest'
      })
    ).toBe(false)
  })
})

describe('getDisplayValue function', () => {
  it('Return "name" w/ displayField=UNDEFINED', () => {
    expect(
      getDisplayValue({
        schema: schema,
        modelName: 'DefaultsTest',
        node: { name: 'name' }
      })
    ).toBe('name')
  })

  it('Return displayField w/ displayField=DEFINED', () => {
    expect(
      getDisplayValue({
        schema: schema,
        modelName: 'PredefinedTest',
        node: { foo: 'foo' }
      })
    ).toBe('foo')
    // displayField: () => 'bar'
    expect(
      getDisplayValue({
        schema: R.assocPath(
          ['PredefinedTest', 'displayField'],
          () => 'bar',
          schema
        ),
        modelName: 'PredefinedTest',
        node: { bar: 'bar' }
      })
    ).toBe('bar')
  })
})

describe('getFieldLabel function', () => {
  it('Return humanized fieldName w/ displayName=UNDEFINED', () => {
    expect(
      getFieldLabel({
        schema: schema,
        modelName: 'DefaultsTest',
        fieldName: 'id'
      })
    ).toBe('Id')
    expect(
      getFieldLabel({
        schema: schema,
        modelName: 'DefaultsTest',
        fieldName: 'name'
      })
    ).toBe('Name')
  })

  it('Return displayName w/ editable=DEFINED', () => {
    expect(
      getFieldLabel({
        schema: schema,
        modelName: 'PredefinedTest',
        fieldName: 'id'
      })
    ).toBe('ID #')
    expect(
      getFieldLabel({
        schema: schema,
        modelName: 'PredefinedTest',
        fieldName: 'name'
      })
    ).toBe('Field Name')
    // displayName: () => 'foobar'
    expect(
      getFieldLabel({
        schema: schema,
        modelName: 'PredefinedTest',
        fieldName: 'foo'
      })
    ).toBe('foobar')
  })
})

describe('getModelLabel function', () => {
  it('Return titleized and humanized modelName w/ displayName=UNDEFINED', () => {
    expect(
      getModelLabel({
        schema: schema,
        modelName: 'DefaultsTest'
      })
    ).toBe('Defaults Test')
    expect(
      getModelLabel({
        schema: R.assocPath(
          ['titleize test', 'fieldName'],
          'titleize test',
          schema
        ),
        modelName: 'titleize test'
      })
    ).toBe('Titleize Test')
  })

  it('Return displayName w/ displayName=DEFINED', () => {
    expect(
      getModelLabel({
        schema: schema,
        modelName: 'PredefinedTest'
      })
    ).toBe('Predefined Test')
    // displayName: () => 'Pre Test'
    expect(
      getModelLabel({
        schema: R.assocPath(
          ['PredefinedTest', 'displayName'],
          () => 'Pre Test',
          schema
        ),
        modelName: 'PredefinedTest'
      })
    ).toBe('Pre Test')
  })
})

describe('getModelLabelPlural function', () => {
  it('Return pluralized and titleized modelName w/ displayNamePlural=UNDEFINED', () => {
    expect(
      getModelLabelPlural({
        schema: schema,
        modelName: 'DefaultsTest'
      })
    ).toBe('DefaultsTests')
    expect(
      getModelLabelPlural({
        schema: R.assocPath(
          ['titleize test', 'fieldName'],
          'titleize test',
          schema
        ),
        modelName: 'titleize test'
      })
    ).toBe('Titleize Tests')
  })

  it('Return displayNamePlural w/ displayNamePlural=DEFINED', () => {
    expect(
      getModelLabelPlural({
        schema: schema,
        modelName: 'PredefinedTest'
      })
    ).toBe('Predefined Tests')
    // displayName: () => 'Pre Tests'
    expect(
      getModelLabelPlural({
        schema: R.assocPath(
          ['PredefinedTest', 'displayNamePlural'],
          () => 'Pre Tests',
          schema
        ),
        modelName: 'PredefinedTest'
      })
    ).toBe('Pre Tests')
  })
})

describe('getCreateFields function', () => {
  it('Return [fieldName which != "id"] w/ showCreate=UNDEFINED', () => {
    expect(
      getCreateFields({
        schema: schema,
        modelName: 'DefaultsTest'
      })
    ).toStrictEqual(['name'])
  })

  it('Return [fieldName where showCreate == true] w/ showCreate=DEFINED BOOLEAN / FUNC', () => {
    expect(
      getCreateFields({
        schema: schema,
        modelName: 'PredefinedTest'
      })
    ).toStrictEqual(['id'])
  })
})

describe('getDetailFields function', () => {
  it('Return [fieldName which != "id"] w/ showDetail=UNDEFINED', () => {
    expect(
      getDetailFields({
        schema: schema,
        modelName: 'DefaultsTest'
      })
    ).toStrictEqual(['name'])
  })

  it('Return [fieldName where showDetail == true] w/ showDetail=DEFINED BOOLEAN / FUNC', () => {
    expect(
      getDetailFields({
        schema: schema,
        modelName: 'PredefinedTest'
      })
    ).toStrictEqual(['id'])
  })
})

describe('getIndexFields function', () => {
  it('Return [] w/ showIndex=UNDEFINED for all fields', () => {
    expect(
      getIndexFields({
        schema: schema,
        modelName: 'DefaultsTest'
      })
    ).toStrictEqual([])
  })

  it('Return [fieldName where showIndex == true] w/ showIndex=DEFINED BOOLEAN / FUNC', () => {
    expect(
      getIndexFields({
        schema: schema,
        modelName: 'PredefinedTest'
      })
    ).toStrictEqual(['id', 'foo', 'bar'])
  })
})

describe('getTooltipFields function', () => {
  it('Return [] w/ showTooltip=UNDEFINED for all fields', () => {
    expect(getTooltipFields(schema, 'DefaultsTest')).toStrictEqual([])
  })

  it('Return [fieldName where showTooltip == true] w/ showTooltip=DEFINED BOOLEAN / FUNC', () => {
    expect(getTooltipFields(schema, 'PredefinedTest')).toStrictEqual([
      'id',
      'foo',
      'bar'
    ])
  })
})

describe('getHasIndex function', () => {
  it('Return true w/ hasIndex=UNDEFINED', () => {
    expect(getHasIndex(schema, 'DefaultsTest')).toBe(true)
  })

  it('Return hasIndex w/ hasIndex=DEFINED', () => {
    expect(getHasIndex(schema, 'PredefinedTest')).toBe(false)
  })
})
