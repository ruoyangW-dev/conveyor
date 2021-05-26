import React from 'react'
import { Table } from './table/Table'
import * as R from 'ramda'
import CreateButton from './CreateButton'
import { FilterModal, FilterModalButton } from './table/Filter'
import { Redirect } from 'react-router-dom'
import { skipOverride, useOverride } from './Utils'

export const DefaultIndexTitle = ({
  schema,
  modelName,
  selectOptions,
  path,
  data,
  tableView,
  customProps
}) => {
  const actions = schema.getActions(modelName)
  const onCreateClick = R.path(['create', 'onIndexCreate'], actions)
  const onClick = () => onCreateClick({ modelName, path })
  const creatable = schema.isCreatable({ modelName, data, customProps })
  const filterable = schema.isTableFilterable({ modelName, data, customProps })
  const currentFilters = R.path([modelName, 'filter', 'filterValue'], tableView)
  const filterOrder = R.path([modelName, 'filter', 'filterOrder'], tableView)
  const filtersAreActive = R.path(
    [modelName, 'filter', 'filtersAreActive'],
    tableView
  )

  return (
    <div
      className={
        'title-label-container conv-default-index-title conv-default-index-title-' +
        modelName
      }
    >
      <h3 className="d-inline">
        {schema.getModelLabelPlural({ modelName, data, customProps })}
      </h3>
      {filterable && (
        <FilterModal
          {...{
            schema,
            modelName,
            selectOptions,
            data,
            filterOrder,
            filterInputs: currentFilters,
            customProps
          }}
        />
      )}
      <div className="float-right">
        {filterable && (
          <FilterModalButton {...{ modelName, filtersAreActive }} />
        )}
        {creatable && <CreateButton {...{ onClick }} />}
      </div>
    </div>
  )
}

const PageNotFound = () => (
  <div id="page-not-found" className="text-center mt-5">
    <h1>Page Not Found</h1>
  </div>
)

export const DefaultIndex = ({
  schema,
  modelName,
  data,
  modalData,
  editData,
  selectOptions,
  path,
  tooltipData,
  tableView,
  customProps,
  summary
}) => {
  if (!schema.getHasIndex(modelName) || R.isNil(schema.getModel(modelName))) {
    return <PageNotFound />
  }

  const IndexTitleOverride = schema.getIndexTitleOverride(modelName)
  const IndexPageOverride = schema.getIndexPageOverride(modelName)

  const IndexTitle = useOverride(IndexTitleOverride, DefaultIndexTitle)
  const IndexPage = useOverride(IndexPageOverride, Table)

  const fieldOrder = schema.getIndexFields({
    modelName,
    data,
    customProps
  })
  const actions = schema.getActions(modelName)
  const onDelete = R.path(['delete', 'onIndexDelete'], actions)
  const onEditSubmit = R.path(['edit', 'onIndexEditSubmit'], actions)

  if (skipOverride(IndexTitleOverride) && skipOverride(IndexPageOverride)) {
    return null
  }

  return (
    <div className={'container conv-index conv-index-' + modelName}>
      <IndexTitle
        {...{
          schema,
          modelName,
          data,
          modalData,
          editData,
          selectOptions,
          path,
          tooltipData,
          tableView,
          customProps
        }}
      />
      <IndexPage
        {...{
          schema,
          modelName,
          data,
          modalData,
          editData,
          selectOptions,
          tooltipData,
          tableView,
          customProps,
          fieldOrder,
          fromIndex: true,
          onDelete,
          onEditSubmit,
          summary
        }}
      />
    </div>
  )
}

const Index = ({
  schema,
  modelName,
  data,
  modalData,
  editData,
  selectOptions,
  path,
  tooltipData,
  tableView,
  customProps,
  summary
}) => {
  // if singleton, Index redirects to Detail pg
  if (schema.getSingleton(modelName)) {
    const singleton = R.last(data)
    // singleton may not be null when last deleted; test for 'id'
    const singleId = R.propOr(null, 'id', singleton)
    if (singleId) {
      return <Redirect to={`/${modelName}/${singleId}`} />
    }
    // if no singleId exists, must create
    const actions = schema.getActions(modelName)
    const onCreateClick = R.path(['create', 'onIndexCreate'], actions)
    return (
      <div className="container">
        <h1>
          {`No ${schema.getModelLabel({
            modelName,
            data,
            customProps
          })} Exists`}
          <CreateButton
            {...{
              onClick: () => onCreateClick({ modelName })
            }}
          />
        </h1>
      </div>
    )
  }

  const IndexOverride = schema.getIndexOverride(modelName)
  const IndexComponent = useOverride(IndexOverride, DefaultIndex)

  return (
    <IndexComponent
      {...{
        schema,
        modelName,
        data,
        modalData,
        editData,
        selectOptions,
        path,
        tooltipData,
        tableView,
        customProps,
        summary
      }}
    />
  )
}

export default Index
