import React from 'react'
import { schema } from './__mocks__/mock_data/schema'
import {
  getIndexOverride,
  getIndexPageOverride,
  getIndexTitleOverride,
  getCreateOverride,
  getCreatePageOverride,
  getCreateTitleOverride,
  getDetailOverride,
  getDetailPageOverride,
  getDetailTitleOverride
} from '../src/Utils'

// Tests
describe('getIndexOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(getIndexOverride(schema, 'NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(getIndexOverride(schema, 'ModelOverride')()).toStrictEqual(
      <h1>Custom Index</h1>
    )
  })
})

describe('getIndexPageOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(getIndexPageOverride(schema, 'NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(getIndexPageOverride(schema, 'ModelOverride')()).toStrictEqual(
      <h1>Custom Index Page</h1>
    )
  })
})

describe('getIndexTitleOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(getIndexTitleOverride(schema, 'NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(getIndexTitleOverride(schema, 'ModelOverride')()).toStrictEqual(
      <h1>Custom Index Title</h1>
    )
  })
})

describe('getCreateOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(getCreateOverride(schema, 'NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(getCreateOverride(schema, 'ModelOverride')()).toStrictEqual(
      <h1>Custom Create</h1>
    )
  })
})

describe('getCreatePageOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(getCreatePageOverride(schema, 'NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(getCreatePageOverride(schema, 'ModelOverride')()).toStrictEqual(
      <h1>Custom Create Page</h1>
    )
  })
})

describe('getCreateTitleOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(getCreateTitleOverride(schema, 'NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(getCreateTitleOverride(schema, 'ModelOverride')()).toStrictEqual(
      <h1>Custom Create Title</h1>
    )
  })
})

describe('getDetailOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(getDetailOverride(schema, 'NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(getDetailOverride(schema, 'ModelOverride')()).toStrictEqual(
      <h1>Custom Detail</h1>
    )
  })
})

describe('getDetailPageOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(getDetailPageOverride(schema, 'NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(getDetailPageOverride(schema, 'ModelOverride')()).toStrictEqual(
      <h1>Custom Detail Page</h1>
    )
  })
})

describe('getDetailTitleOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(getDetailTitleOverride(schema, 'NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(getDetailTitleOverride(schema, 'ModelOverride')()).toStrictEqual(
      <h1>Custom Detail Title</h1>
    )
  })
})
