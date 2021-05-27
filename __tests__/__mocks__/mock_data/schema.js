import React from 'react'

const DefaultsTest = {
  fields: {
    id: {
      fieldName: 'id',
      type: 'ID'
    },
    name: {
      fieldName: 'name',
      type: 'string'
    }
  },
  modelName: 'Defaults_Test',
  tableLinkField: 'name',
  fieldOrder: ['name']
}

const PredefinedTest = {
  deletable: false,
  creatable: false,
  displayField: 'foo',
  displayName: 'Predefined Test',
  displayNamePlural: 'Predefined Tests',
  fields: {
    id: {
      fieldName: 'id',
      type: 'ID',
      editable: true,
      displayName: 'ID #',
      showCreate: true,
      showDetail: true,
      showIndex: true,
      showTooltip: true
    },
    name: {
      fieldName: 'name',
      type: 'string',
      editable: false,
      displayName: 'Field Name',
      showCreate: false,
      showDetail: false,
      showTooltip: false
    },
    foo: {
      fieldName: 'foo',
      type: 'string',
      editable: () => true,
      displayName: () => 'foobar',
      showCreate: () => false,
      showDetail: () => false,
      showIndex: () => true,
      showTooltip: () => true
    },
    bar: {
      fieldName: 'bar',
      type: 'string',
      editable: 42,
      showCreate: false,
      showDetail: false,
      showIndex: true,
      showTooltip: true
    }
  },
  hasIndex: false,
  modelName: 'PredefinedTest',
  tableLinkField: 'name',
  fieldOrder: ['id', 'name', 'foo', 'bar']
}

const NoModelOverride = {
  deletable: true,
  creatable: true,
  displayField: 'foo',
  displayName: 'No Model Override',
  displayNamePlural: 'No Model Overrides',
  fields: {
    id: {
      fieldName: 'id',
      type: 'ID',
      editable: false,
      displayName: 'ID #',
      showCreate: false,
      showDetail: false,
      showIndex: false,
      showTooltip: false
    },
    name: {
      fieldName: 'name',
      type: 'string',
      editable: true,
      displayName: 'Name',
      showCreate: true,
      showDetail: true,
      showTooltip: true
    }
  },
  hasIndex: true,
  modelName: 'NoModelOverride',
  tableLinkField: 'name',
  fieldOrder: ['name']
}

const ModelOverride = {
  deletable: true,
  creatable: true,
  displayField: 'name',
  displayName: 'Model Override',
  displayNamePlural: 'Model Overrides',
  fields: {
    id: {
      fieldName: 'id',
      type: 'ID',
      editable: false,
      displayName: 'ID #',
      showCreate: false,
      showDetail: false,
      showIndex: false,
      showTooltip: false
    },
    name: {
      fieldName: 'name',
      type: 'string',
      editable: true,
      displayName: 'Name',
      showCreate: true,
      showDetail: true,
      showTooltip: true
    }
  },
  hasIndex: true,
  modelName: 'ModelOverride',
  tableLinkField: 'name',
  fieldOrder: ['name'],
  components: {
    createTitle: (props) => <h1>Custom Create Title</h1>,
    detailTitle: (props) => <h1>Custom Detail Title</h1>,
    indexTitle: (props) => <h1>Custom Index Title</h1>,
    createPage: (props) => <h1>Custom Create Page</h1>,
    detailPage: (props) => <h1>Custom Detail Page</h1>,
    indexPage: (props) => <h1>Custom Index Page</h1>,
    create: (props) => <h1>Custom Create</h1>,
    detail: (props) => <h1>Custom Detail</h1>,
    index: (props) => <h1>Custom Index</h1>
  }
}

export const schema = {
  DefaultsTest,
  PredefinedTest,
  NoModelOverride,
  ModelOverride
}
